export const storageKeys = {
  CHAT_HISTORY: "sgoai-chat-history",
  SELECTED_MODE: "sgoai-selected-mode",
  LANGUAGE_PROGRESS: "sgoai-language-progress",
};

export const storage = {
  set: (key: string, value: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  get: (key: string) => {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  },
  remove: (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};
