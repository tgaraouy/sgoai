import { storage, storageKeys } from "./storage";

interface Progress {
  phrases: string[];
  completedLessons: string[];
  lastPractice: string;
  streak: number;
}

export const progressTracker = {
  initProgress: () => {
    const existing = storage.get(storageKeys.LANGUAGE_PROGRESS);
    if (!existing) {
      storage.set(storageKeys.LANGUAGE_PROGRESS, {
        phrases: [],
        completedLessons: [],
        lastPractice: new Date().toISOString(),
        streak: 0,
      });
    }
  },

  updateProgress: (data: Partial<Progress>) => {
    const current = storage.get(storageKeys.LANGUAGE_PROGRESS);
    storage.set(storageKeys.LANGUAGE_PROGRESS, {
      ...current,
      ...data,
    });
  },

  addPhrase: (phrase: string) => {
    const current = storage.get(storageKeys.LANGUAGE_PROGRESS);
    if (!current.phrases.includes(phrase)) {
      progressTracker.updateProgress({
        phrases: [...current.phrases, phrase],
      });
    }
  },
};
