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
          id?: string;
          user_id?: string;
          prompt?: string;
          response?: string;
          mode?: string;
          timestamp?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          travel_status: string | null;
          current_city: string | null;
          preferred_mode: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          travel_status?: string | null;
          current_city?: string | null;
          preferred_mode?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          travel_status?: string | null;
          current_city?: string | null;
          preferred_mode?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
