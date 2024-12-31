// src/types/darija.ts
export interface CulturalContext {
  explanation: string;
  examples: string[];
  cultural_notes: string[];
}

export interface MeaningDetails {
  literal: string;
  figurative: string;
  variations: string[];
  similar_phrases: string[];
}

export interface UsageContexts {
  formal: string[];
  informal: string[];
  regional_variations: string[];
  situational_examples: string[];
}

export interface RelatedContent {
  synonyms: string[];
  antonyms: string[];
  related_phrases: string[];
  common_combinations: string[];
}

export interface PhraseMetadata {
  formality_level: "formal" | "semi_formal" | "informal" | "very_informal";
  age_group: "children" | "youth" | "adults" | "elderly" | "all";
  gender_specific: boolean;
  regional_preference: string;
  frequency_of_use: "very_high" | "high" | "medium" | "low" | "rare";
  social_context: string[];
}

export interface DarijaPhrase {
  id: string;
  darija: string;
  phonetic_transcription: string;
  translations: Record<string, string>;
  category: Record<string, string>;
  scenario: Record<string, string>;
  difficulty: "beginner" | "intermediate" | "advanced";
  picture_link: string | null;
  likes: number;
  cultural_context: CulturalContext;
  meaning_details: MeaningDetails;
  usage_contexts: UsageContexts;
  related_content: RelatedContent;
  metadata: PhraseMetadata;
  created_at: string;
  updated_at: string;
}
