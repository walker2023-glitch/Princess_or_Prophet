export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; display_name: string | null; role: "teacher"; created_at: string };
        Insert: { id: string; display_name?: string | null; role?: "teacher" };
        Update: { display_name?: string | null; role?: "teacher" };
        Relationships: [];
      };
      quote_packs: {
        Row: { id: string; owner_id: string; title: string; description: string; status: "draft" | "ready" | "archived"; created_at: string; updated_at: string };
        Insert: { owner_id: string; title: string; description?: string; status?: "draft" | "ready" | "archived" };
        Update: { title?: string; description?: string; status?: "draft" | "ready" | "archived" };
        Relationships: [];
      };
      quotes: {
        Row: {
          id: string;
          quote_pack_id: string;
          text: string;
          speaker_name: string;
          speaker_category: string;
          year: number;
          source_title: string;
          source_type: string;
          source_url: string;
          explanation: string;
          theme: string;
          verification_status: string;
          copyright_notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["quotes"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["quotes"]["Insert"]>;
        Relationships: [];
      };
      question_variations: {
        Row: { id: string; quote_id: string; question_type: string; prompt: string; answer_options: Json; correct_answer: string; enabled: boolean; reviewed: boolean; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["question_variations"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["question_variations"]["Insert"]>;
        Relationships: [];
      };
      games: {
        Row: { id: string; owner_id: string; quote_pack_id: string; join_code: string; status: "lobby" | "active" | "finished" | "cancelled"; settings: Json; created_at: string; started_at: string | null; ended_at: string | null };
        Insert: { owner_id: string; quote_pack_id: string; join_code: string; status?: "lobby" | "active" | "finished" | "cancelled"; settings?: Json };
        Update: Partial<Database["public"]["Tables"]["games"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
