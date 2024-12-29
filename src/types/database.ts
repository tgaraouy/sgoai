export interface AIInteraction {
  id: string;
  user_id: string;
  prompt: string;
  response: string;
  mode: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  email: string;
  travel_status: "current" | "planning" | null;
  current_city: string | null;
  preferred_mode: string | null;
  created_at: string;
  updated_at: string;
}
