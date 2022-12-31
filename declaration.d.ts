declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";

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
type Tables = PublicSchema["Tables"];
type Table = keyof Tables;

type Game = Tables["games"]["Row"];
