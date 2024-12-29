import type { Database } from "@/types/supabase";
import { supabase } from "./supabase";

export async function createAIInteraction({
  userId,
  prompt,
  response,
  mode,
}: {
  userId: string;
  prompt: string;
  response: string;
  mode: string;
}) {
  const { data, error } = await supabase
    .from("ai_interactions")
    .insert([
      {
        user_id: userId,
        prompt,
        response,
        mode,
        timestamp: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile({
  userId,
  updates,
}: {
  userId: string;
  updates: Partial<Database["public"]["Tables"]["user_profiles"]["Update"]>;
}) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserInteractions(userId: string) {
  const { data, error } = await supabase
    .from("ai_interactions")
    .select("*")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false });

  if (error) throw error;
  return data;
}
