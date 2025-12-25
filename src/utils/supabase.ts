import { createClient, PostgrestError } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface DailyStreak {
  id: string;
  user_id: string;
  current_streak: number;
  last_claim_date: string | null;
  claimed_today: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRewardsData {
  points: UserPoints | null;
  streak: DailyStreak | null;
}

export const supabaseApi = {
  async getUserPoints(userId: string): Promise<UserPoints | null> {
    const { data, error } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      if ((error as PostgrestError)?.code === "PGRST116") return null;
      console.error("Error fetching user points:", error);
      return null;
    }
    return data as UserPoints | null;
  },

  async getDailyStreak(userId: string): Promise<DailyStreak | null> {
    const { data, error } = await supabase
      .from("daily_streaks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      if ((error as PostgrestError)?.code === "PGRST116") return null;
      console.error("Error fetching daily streak:", error);
      return null;
    }
    return data as DailyStreak | null;
  },

  async getUserRewardsData(userId: string): Promise<UserRewardsData> {
    const [points, streak] = await Promise.all([
      this.getUserPoints(userId),
      this.getDailyStreak(userId),
    ]);
    return { points, streak };
  },

  async claimDailyStreak(userId: string): Promise<{
    success: boolean;
    message: string;
    newPoints?: number;
    newStreak?: number;
  }> {
    const today = new Date().toISOString().split("T")[0];

    const { data: streakData, error: streakError } = await supabase
      .from("daily_streaks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (streakError) {
      if ((streakError as PostgrestError)?.code !== "PGRST116") {
        return { success: false, message: "Error fetching streak data" };
      }
    }

    if (streakData?.last_claim_date === today) {
      return { success: false, message: "Already claimed today" };
    }

    let newStreak = 1;
    if (streakData) {
      const lastClaimDate = streakData.last_claim_date
        ? new Date(streakData.last_claim_date)
        : null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastClaimDate && streakData.last_claim_date === yesterdayStr) {
        newStreak = streakData.current_streak + 1;
      }
    }

    const { error: updateStreakError } = await supabase
      .from("daily_streaks")
      .upsert(
        {
          user_id: userId,
          current_streak: newStreak,
          last_claim_date: today,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (updateStreakError) {
      return { success: false, message: "Error updating streak" };
    }

    const pointsToAdd = 5;
    const { data: currentPoints } = await supabase
      .from("user_points")
      .select("total_points")
      .eq("user_id", userId)
      .maybeSingle();

    const newTotalPoints =
      ((currentPoints as UserPoints)?.total_points || 0) + pointsToAdd;

    const { error: updatePointsError } = await supabase
      .from("user_points")
      .upsert(
        {
          user_id: userId,
          total_points: newTotalPoints,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (updatePointsError) {
      return { success: false, message: "Error updating points" };
    }

    return {
      success: true,
      message: "Successfully claimed daily streak!",
      newPoints: newTotalPoints,
      newStreak,
    };
  },

  // Initialize user rewards (call when user signs up)
  async initializeUserRewards(userId: string): Promise<boolean> {
    try {
      await supabase.from("user_points").upsert(
        {
          user_id: userId,
          total_points: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      await supabase.from("daily_streaks").upsert(
        {
          user_id: userId,
          current_streak: 0,
          last_claim_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      return true;
    } catch (error) {
      console.error("Error initializing user rewards:", error);
      return false;
    }
  },
};
