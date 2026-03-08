export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      // ─── Existing Tables ──────────────────────────────────────────
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          description: string | null;
          category: "uphaar" | "kyddoz" | "festive";
          images: string[] | null;
          tags: string[] | null;
          delivery_time: string | null;
          availability: boolean | null;
          featured: boolean | null;
          limited: boolean | null;
          created_at: string | null;
          aspect_ratio: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          description?: string | null;
          category: "uphaar" | "kyddoz" | "festive";
          images?: string[] | null;
          tags?: string[] | null;
          delivery_time?: string | null;
          availability?: boolean | null;
          featured?: boolean | null;
          limited?: boolean | null;
          created_at?: string | null;
          aspect_ratio?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["wishlist"]["Insert"]>;
      };
      cart: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["cart"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          items: Json;
          total: number;
          customer_details: Json;
          status: string;
          created_at: string | null;
          updated_at?: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          items: Json;
          total: number;
          customer_details: Json;
          status?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          phone: string | null;
          role: "admin" | "user" | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          phone?: string | null;
          role?: "admin" | "user" | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };

      // ─── Marketing & Analytics Tables ─────────────────────────────
      customer_behavior: {
        Row: {
          id: string;
          customer_id: string | null;
          session_id: string;
          event_type: string;
          product_id: string | null;
          product_name: string | null;
          page_url: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          session_id: string;
          event_type: string;
          product_id?: string | null;
          product_name?: string | null;
          page_url?: string | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["customer_behavior"]["Insert"]>;
      };
      customer_analytics: {
        Row: {
          id: string;
          customer_id: string;
          last_visit: string | null;
          segment: string | null;
          total_sessions: number | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          customer_id: string;
          last_visit?: string | null;
          segment?: string | null;
          total_sessions?: number | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["customer_analytics"]["Insert"]>;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          subscribed_at: string | null;
          active: boolean | null;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          subscribed_at?: string | null;
          active?: boolean | null;
        };
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]>;
      };
    };
    Storage: {
      Buckets: {
        products: { name: "products" };
        featured: { name: "featured" };
      };
      Objects: Record<string, unknown>;
    };
  };
};
