// src/lib/storage/offlineManager.ts
import { DarijaPhrase } from "@/types/darija";

const SAVED_PHRASES_KEY = "saved_darija_phrases";
const OFFLINE_PHRASES_KEY = "offline_darija_phrases";

export const offlineManager = {
  // Save phrase for offline use
  savePhrase: (phrase: DarijaPhrase) => {
    try {
      const savedPhrases = JSON.parse(
        localStorage.getItem(SAVED_PHRASES_KEY) || "[]"
      );
      if (!savedPhrases.find((p: DarijaPhrase) => p.id === phrase.id)) {
        savedPhrases.push(phrase);
        localStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(savedPhrases));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving phrase:", error);
      return false;
    }
  },

  // Remove saved phrase
  removePhrase: (phraseId: string) => {
    try {
      const savedPhrases = JSON.parse(
        localStorage.getItem(SAVED_PHRASES_KEY) || "[]"
      );
      const filtered = savedPhrases.filter(
        (p: DarijaPhrase) => p.id !== phraseId
      );
      localStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error("Error removing phrase:", error);
      return false;
    }
  },

  // Get all saved phrases
  getSavedPhrases: (): DarijaPhrase[] => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_PHRASES_KEY) || "[]");
    } catch (error) {
      console.error("Error getting saved phrases:", error);
      return [];
    }
  },

  // Cache essential phrases for offline use
  cacheEssentialPhrases: (phrases: DarijaPhrase[]) => {
    try {
      localStorage.setItem(OFFLINE_PHRASES_KEY, JSON.stringify(phrases));
      return true;
    } catch (error) {
      console.error("Error caching phrases:", error);
      return false;
    }
  },

  // Get cached phrases
  getCachedPhrases: (): DarijaPhrase[] => {
    try {
      return JSON.parse(localStorage.getItem(OFFLINE_PHRASES_KEY) || "[]");
    } catch (error) {
      console.error("Error getting cached phrases:", error);
      return [];
    }
  },

  // Check if phrase is saved
  isPhraseInSaved: (phraseId: string): boolean => {
    try {
      const savedPhrases = JSON.parse(
        localStorage.getItem(SAVED_PHRASES_KEY) || "[]"
      );
      return savedPhrases.some((p: DarijaPhrase) => p.id === phraseId);
    } catch (error) {
      console.error("Error checking saved phrase:", error);
      return false;
    }
  },
};
