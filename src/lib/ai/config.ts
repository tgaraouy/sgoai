export const AI_CONFIG = {
  apiKey: process.env.AI_API_KEY,
  baseUrl: process.env.AI_API_BASE_URL,
  maxTokens: 1000,
  temperature: 0.7,
};

export const AI_ENDPOINTS = {
  chat: "/api/ai/chat",
  ask: "/api/ai/ask",
  cultural: "/api/ai/cultural",
  pronunciation: "/api/ai/pronunciation",
};
