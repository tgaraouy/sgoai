// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      darija_phrases: {
        Row: {
          id: string;
          darija: string;
          phonetic_transcription: string;
          translations: Json;
          category: Json;
          scenario: Json;
          difficulty: string;
          picture_link: string | null;
          likes: number;
          created_at: string;
          updated_at: string;
          cultural_context: {
            explanation: string;
            examples: string[];
            cultural_notes: string[];
          };
          meaning_details: {
            literal: string;
            figurative: string;
            variations: string[];
            similar_phrases: string[];
          };
          usage_contexts: {
            formal: string[];
            informal: string[];
            regional_variations: string[];
            situational_examples: string[];
          };
          related_content: {
            synonyms: string[];
            antonyms: string[];
            related_phrases: string[];
            common_combinations: string[];
          };
          metadata: {
            formality_level:
              | "formal"
              | "semi_formal"
              | "informal"
              | "very_informal";
            age_group: "children" | "youth" | "adults" | "elderly" | "all";
            gender_specific: boolean;
            regional_preference: string;
            frequency_of_use: "very_high" | "high" | "medium" | "low" | "rare";
            social_context: string[];
          };
        };
        Insert: {
          id?: string;
          darija: string;
          phonetic_transcription: string;
          translations?: Json;
          category?: Json;
          scenario?: Json;
          difficulty: string;
          picture_link?: string | null;
          likes?: number;
          created_at?: string;
          updated_at?: string;
          cultural_context?: {
            explanation: string;
            examples: string[];
            cultural_notes: string[];
          };
          meaning_details?: {
            literal: string;
            figurative: string;
            variations: string[];
            similar_phrases: string[];
          };
          usage_contexts?: {
            formal: string[];
            informal: string[];
            regional_variations: string[];
            situational_examples: string[];
          };
          related_content?: {
            synonyms: string[];
            antonyms: string[];
            related_phrases: string[];
            common_combinations: string[];
          };
          metadata?: {
            formality_level:
              | "formal"
              | "semi_formal"
              | "informal"
              | "very_informal";
            age_group: "children" | "youth" | "adults" | "elderly" | "all";
            gender_specific: boolean;
            regional_preference: string;
            frequency_of_use: "very_high" | "high" | "medium" | "low" | "rare";
            social_context: string[];
          };
        };
        Update: {
          id?: string;
          darija?: string;
          phonetic_transcription?: string;
          translations?: Json;
          category?: Json;
          scenario?: Json;
          difficulty?: string;
          picture_link?: string | null;
          likes?: number;
          created_at?: string;
          updated_at?: string;
          cultural_context?: {
            explanation: string;
            examples: string[];
            cultural_notes: string[];
          };
          meaning_details?: {
            literal: string;
            figurative: string;
            variations: string[];
            similar_phrases: string[];
          };
          usage_contexts?: {
            formal: string[];
            informal: string[];
            regional_variations: string[];
            situational_examples: string[];
          };
          related_content?: {
            synonyms: string[];
            antonyms: string[];
            related_phrases: string[];
            common_combinations: string[];
          };
          metadata?: {
            formality_level:
              | "formal"
              | "semi_formal"
              | "informal"
              | "very_informal";
            age_group: "children" | "youth" | "adults" | "elderly" | "all";
            gender_specific: boolean;
            regional_preference: string;
            frequency_of_use: "very_high" | "high" | "medium" | "low" | "rare";
            social_context: string[];
          };
        };
      };
      learning_progress: {
        Row: {
          id: string;
          user_id: string;
          phrase_id: string;
          mastery: number;
          practice_count: number;
          last_practiced: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          phrase_id: string;
          mastery: number;
          practice_count?: number;
          last_practiced?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          phrase_id?: string;
          mastery?: number;
          practice_count?: number;
          last_practiced?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          travel_status: "current" | "planning" | null;
          current_city: string | null;
          preferred_mode: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          travel_status?: "current" | "planning" | null;
          current_city?: string | null;
          preferred_mode?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          travel_status?: "current" | "planning" | null;
          current_city?: string | null;
          preferred_mode?: string | null;
          updated_at?: string;
        };
      };
      ai_interactions: {
        Row: {
          id: string;
          user_id: string;
          prompt: string;
          response: string;
          mode: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt: string;
          response: string;
          mode: string;
          timestamp?: string;
        };
        Update: {
          user_id?: string;
          prompt?: string;
          response?: string;
          mode?: string;
          timestamp?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
