export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      conferences: {
        Row: {
          id: number;
          name: string | null;
        };
        Insert: {
          id?: number;
          name?: string | null;
        };
        Update: {
          id?: number;
          name?: string | null;
        };
      };
      divisions: {
        Row: {
          id: number;
          name: string | null;
        };
        Insert: {
          id?: number;
          name?: string | null;
        };
        Update: {
          id?: number;
          name?: string | null;
        };
      };
      hottakes: {
        Row: {
          created_at: string | null;
          deleted: number | null;
          id: string;
          linked_teams: Json | null;
          message: string | null;
          user: string;
        };
        Insert: {
          created_at?: string | null;
          deleted?: number | null;
          id?: string;
          linked_teams?: Json | null;
          message?: string | null;
          user: string;
        };
        Update: {
          created_at?: string | null;
          deleted?: number | null;
          id?: string;
          linked_teams?: Json | null;
          message?: string | null;
          user?: string;
        };
      };
      reactions: {
        Row: {
          created_at: string | null;
          hottake: string | null;
          id: string;
          reaction: number | null;
          user: string;
        };
        Insert: {
          created_at?: string | null;
          hottake?: string | null;
          id?: string;
          reaction?: number | null;
          user: string;
        };
        Update: {
          created_at?: string | null;
          hottake?: string | null;
          id?: string;
          reaction?: number | null;
          user?: string;
        };
      };
      teams: {
        Row: {
          abbreviation: string | null;
          city: string | null;
          conference: number | null;
          division: number | null;
          full_name: string | null;
          id: number;
          logo: string | null;
          name: string | null;
          primary_color: string | null;
          secondary_color: string | null;
        };
        Insert: {
          abbreviation?: string | null;
          city?: string | null;
          conference?: number | null;
          division?: number | null;
          full_name?: string | null;
          id?: number;
          logo?: string | null;
          name?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
        };
        Update: {
          abbreviation?: string | null;
          city?: string | null;
          conference?: number | null;
          division?: number | null;
          full_name?: string | null;
          id?: number;
          logo?: string | null;
          name?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
        };
      };
      users: {
        Row: {
          created_at: string | null;
          favorite_team: number | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          created_at?: string | null;
          favorite_team?: number | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          created_at?: string | null;
          favorite_team?: number | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
