export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  confidence?: number;
}

export interface AIContext {
  mode: string;
  travelStatus: "current" | "planning" | null;
  location: string | string[];
  interests: string[];
}
