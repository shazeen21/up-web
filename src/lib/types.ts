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

