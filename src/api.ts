import { createClient } from "@supabase/supabase-js";

interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          captures: null | Record<string, number>;
          currentPlayer: null | number;
          gameover:
            | null
            | { draw: true }
            | { winner: string }
            | { quit: string };
          id: string;
          playOrder: string[];
          players: Record<string, string>;
          status: "PRE" | "LIVE" | "POST";
          tokens: null | Record<number, number>;
        };
        Insert: {};
        Update: {};
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

type PublicSchema = Database["public"];
export type Tables = PublicSchema["Tables"];
export type Table = keyof Tables;

export type Game = Tables["games"]["Row"];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database, "public", Database["public"]>(
  supabaseUrl,
  supabaseAnonKey
);
