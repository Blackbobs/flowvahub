"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseApi } from "@/utils/supabase";

export const rewardsKeys = {
  all: ["rewards"] as const,
  userRewards: (userId: string) =>
    [...rewardsKeys.all, "user", userId] as const,
};

export function useUserRewards(userId: string | null) {
  return useQuery({
    queryKey: rewardsKeys.userRewards(userId || ""),
    queryFn: () => supabaseApi.getUserRewardsData(userId!),
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
}

// Hook to claim daily streak
export function useClaimDailyStreak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => supabaseApi.claimDailyStreak(userId),
    onSuccess: (data, userId) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: rewardsKeys.userRewards(userId),
        });
      }
    },
  });
}

export function useInitializeRewards() {
  return useMutation({
    mutationFn: (userId: string) => supabaseApi.initializeUserRewards(userId),
  });
}

export function getStreakDayInfo(
  lastClaimDate: string | null,
  currentStreak: number
) {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  const todayStr = today.toISOString().split("T")[0];
  const claimedToday = lastClaimDate === todayStr;

  return {
    days,
    currentDayIndex: adjustedDayOfWeek,
    claimedToday,
    currentStreak,
  };
}

export function calculateProgress(
  currentPoints: number,
  targetPoints: number = 5000
): number {
  if (targetPoints === 0) return 0;
  const progress = (currentPoints / targetPoints) * 100;
  return Math.min(progress, 100);
}
export function formatPoints(points: number): string {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toString();
}

export function getProgressMessage(
  points: number,
  target: number = 5000
): string {
  const percentage = (points / target) * 100;

  if (percentage === 0) {
    return "Start earning points to redeem rewards!";
  } else if (percentage < 10) {
    return "Just getting started - keep earning points!";
  } else if (percentage < 25) {
    return "Great progress! Keep going!";
  } else if (percentage < 50) {
    return "You're on your way! Halfway there soon!";
  } else if (percentage < 75) {
    return "Awesome! More than halfway to your goal!";
  } else if (percentage < 100) {
    return "Almost there! So close to your reward!";
  } else {
    return "🎉 Congratulations! You can redeem a reward!";
  }
}

export function useStreakDays(lastClaimDate: string | null) {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const currentDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const days = [
    { label: "M", index: 0 },
    { label: "T", index: 1 },
    { label: "W", index: 2 },
    { label: "T", index: 3 },
    { label: "F", index: 4 },
    { label: "S", index: 5 },
    { label: "S", index: 6 },
  ];

  const todayStr = today.toISOString().split("T")[0];
  const claimedToday = lastClaimDate === todayStr;

  return {
    days,
    currentDayIndex,
    claimedToday,
  };
}
