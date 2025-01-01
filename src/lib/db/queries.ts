import type { Database } from "@/types/supabase";
import { supabase } from "./supabase";

// Add DarijaPhrase interface
export interface DarijaPhrase {
  id: string;
  darija: string;
  phonetic_transcription: string;
  translations: {
    english: string;
    french: string;
  };
  category: {
    english: string;
  };
  scenario: {
    english: string;
  };
  usage_contexts: {
    situational_examples: string[];
  };
}

// Add LearningProgress interface
interface LearningProgress {
  userId: string;
  phraseId: string;
  mastery: number;
}

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

// Add getPhrases function
export async function getPhrases(): Promise<DarijaPhrase[]> {
  try {
    const { data, error } = await supabase
      .from("darija_phrases")
      .select(
        `
        id,
        darija,
        phonetic_transcription,
        translations,
        category,
        scenario,
        usage_contexts
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as DarijaPhrase[]) || [];
  } catch (error) {
    console.error("Error fetching phrases:", error);
    return [];
  }
}

// Add updateLearningProgress function
export async function updateLearningProgress({
  userId,
  phraseId,
  mastery,
}: LearningProgress): Promise<void> {
  try {
    const { error } = await supabase.from("learning_progress").upsert({
      user_id: userId,
      phrase_id: phraseId,
      mastery_level: mastery,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error updating learning progress:", error);
    throw error; // Re-throw to handle in the component
  }
}

// Add function to get user's learning progress
export async function getUserLearningProgress(userId: string) {
  const { data, error } = await supabase
    .from("learning_progress")
    .select(
      `
      phrase_id,
      mastery_level,
      updated_at
    `
    )
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Add function to get specific phrase
export async function getPhraseById(
  phraseId: string
): Promise<DarijaPhrase | null> {
  const { data, error } = await supabase
    .from("darija_phrases")
    .select(
      `
      id,
      darija,
      phonetic_transcription,
      translations,
      category,
      scenario,
      usage_contexts
    `
    )
    .eq("id", phraseId)
    .single();

  if (error) throw error;
  return data as DarijaPhrase;
}
