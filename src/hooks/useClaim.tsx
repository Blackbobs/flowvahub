import React from "react";
import { supabase } from "@/utils/supabase";

export default function useClaim() {
  const emailRef = React.useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleSubmitClaim = async () => {
    setLoading(true);
    setMessage(null);

    // this is just a dummy user id for demo purposes
    const userId = process.env.NEXT_PUBLIC_DUMMY_USER_ID || "dummy-user-123";

    try {
      let screenshotUrl: string | null = null;

      if (file) {
        const path = `claims/${userId}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("claims")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          console.warn("Upload error (continuing):", uploadError.message);
        } else {
          const publicRes = supabase.storage.from("claims").getPublicUrl(path);
          const publicUrlResponse = publicRes as {
            data?: { publicUrl?: string };
            publicURL?: string;
          };
          screenshotUrl =
            publicUrlResponse.data?.publicUrl ??
            publicUrlResponse.publicURL ??
            null;
        }
      }

   
      const { error: insertError } = await supabase.from("tool_claims").insert([
        {
          user_id: userId,
          tool_name: "Reclaim",
          email_used: email || null,
          screenshot_url: screenshotUrl,
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.warn("Error inserting claim record:", insertError.message);
      }

    
      const { data: currentPoints } = await supabase
        .from("user_points")
        .select("total_points")
        .eq("user_id", userId)
        .single();

      const newTotal = (currentPoints?.total_points || 0) + 25;

      const { error: upsertError } = await supabase.from("user_points").upsert(
        {
          user_id: userId,
          total_points: newTotal,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (upsertError) {
        console.warn("Error updating points:", upsertError.message);
      }

      setMessage("Claim submitted — 25 points added (dummy user). 🎉");
    } catch (err) {
      console.error(err);
      setMessage("Error submitting claim. See console.");
    } finally {
      setLoading(false);
    }
  };

  return {
    emailRef,
    email,
    setEmail,
    file,
    setFile,
    loading,
    message,
    handleFileChange,
    handleSubmitClaim,
    setMessage,
  };
}
