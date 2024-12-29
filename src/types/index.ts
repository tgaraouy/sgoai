// Auth types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface Session {
  user: User;
  expires: string;
}

// API types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// AI types
export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  message: string;
  success: boolean;
}

// Component props types
export interface ChatProps {
  initialMessage?: string;
  onResponse?: (response: string) => void;
}

export interface PronunciationProps {
  text?: string;
  onFeedback?: (feedback: string) => void;
}
