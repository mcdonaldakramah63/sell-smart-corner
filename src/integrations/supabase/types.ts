export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ad_analytics: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: unknown | null
          location_data: Json | null
          product_id: string
          referrer: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          location_data?: Json | null
          product_id: string
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          location_data?: Json | null
          product_id?: string
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      business_accounts: {
        Row: {
          business_address: string | null
          business_email: string | null
          business_name: string
          business_phone: string | null
          business_type: string
          created_at: string
          id: string
          registration_number: string | null
          subscription_expires_at: string | null
          subscription_plan: string | null
          tax_id: string | null
          updated_at: string
          user_id: string
          verification_status: string
          website_url: string | null
        }
        Insert: {
          business_address?: string | null
          business_email?: string | null
          business_name: string
          business_phone?: string | null
          business_type: string
          created_at?: string
          id?: string
          registration_number?: string | null
          subscription_expires_at?: string | null
          subscription_plan?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id: string
          verification_status?: string
          website_url?: string | null
        }
        Update: {
          business_address?: string | null
          business_email?: string | null
          business_name?: string
          business_phone?: string | null
          business_type?: string
          created_at?: string
          id?: string
          registration_number?: string | null
          subscription_expires_at?: string | null
          subscription_plan?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: string
          website_url?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          coordinates: unknown | null
          created_at: string
          id: string
          is_active: boolean | null
          location_type: string
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          coordinates?: unknown | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          location_type: string
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          coordinates?: unknown | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          location_type?: string
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          content: string
          created_at: string
          id: string
          read: boolean | null
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_ad_prices: {
        Row: {
          ad_type: Database["public"]["Enums"]["premium_ad_type"]
          created_at: string
          currency: string | null
          description: string | null
          duration_days: number
          id: string
          price: number
          updated_at: string
        }
        Insert: {
          ad_type: Database["public"]["Enums"]["premium_ad_type"]
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_days: number
          id?: string
          price: number
          updated_at?: string
        }
        Update: {
          ad_type?: Database["public"]["Enums"]["premium_ad_type"]
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      premium_ads: {
        Row: {
          ad_type: Database["public"]["Enums"]["premium_ad_type"]
          amount: number
          created_at: string
          currency: string | null
          expires_at: string
          id: string
          payment_reference: string | null
          product_id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_type: Database["public"]["Enums"]["premium_ad_type"]
          amount: number
          created_at?: string
          currency?: string | null
          expires_at: string
          id?: string
          payment_reference?: string | null
          product_id: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ad_type?: Database["public"]["Enums"]["premium_ad_type"]
          amount?: number
          created_at?: string
          currency?: string | null
          expires_at?: string
          id?: string
          payment_reference?: string | null
          product_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "premium_ads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          reviewer_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          reviewer_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          reviewer_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          boost_expires_at: string | null
          brand: string | null
          category_id: string | null
          condition: string | null
          contact_count: number | null
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          is_sold: boolean | null
          location: string | null
          location_id: string | null
          model: string | null
          price: number
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          save_count: number | null
          seller_id: string | null
          status: Database["public"]["Enums"]["product_status"] | null
          title: string
          updated_at: string
          user_id: string
          video_url: string | null
          view_count: number | null
          year_manufactured: number | null
        }
        Insert: {
          boost_expires_at?: string | null
          brand?: string | null
          category_id?: string | null
          condition?: string | null
          contact_count?: number | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_sold?: boolean | null
          location?: string | null
          location_id?: string | null
          model?: string | null
          price: number
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          save_count?: number | null
          seller_id?: string | null
          status?: Database["public"]["Enums"]["product_status"] | null
          title: string
          updated_at?: string
          user_id: string
          video_url?: string | null
          view_count?: number | null
          year_manufactured?: number | null
        }
        Update: {
          boost_expires_at?: string | null
          brand?: string | null
          category_id?: string | null
          condition?: string | null
          contact_count?: number | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_sold?: boolean | null
          location?: string | null
          location_id?: string | null
          model?: string | null
          price?: number
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          save_count?: number | null
          seller_id?: string | null
          status?: Database["public"]["Enums"]["product_status"] | null
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
          view_count?: number | null
          year_manufactured?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          average_rating: number | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_business_account: boolean | null
          location: string | null
          phone: string | null
          response_rate: number | null
          response_time_hours: number | null
          total_ratings: number | null
          total_sales: number | null
          trust_score: number | null
          updated_at: string
          username: string | null
          verification_level: number | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          average_rating?: number | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_business_account?: boolean | null
          location?: string | null
          phone?: string | null
          response_rate?: number | null
          response_time_hours?: number | null
          total_ratings?: number | null
          total_sales?: number | null
          trust_score?: number | null
          updated_at?: string
          username?: string | null
          verification_level?: number | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          average_rating?: number | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_business_account?: boolean | null
          location?: string | null
          phone?: string | null
          response_rate?: number | null
          response_time_hours?: number | null
          total_ratings?: number | null
          total_sales?: number | null
          trust_score?: number | null
          updated_at?: string
          username?: string | null
          verification_level?: number | null
          website?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          report_type: Database["public"]["Enums"]["report_type"]
          reported_product_id: string | null
          reported_user_id: string | null
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          report_type: Database["public"]["Enums"]["report_type"]
          reported_product_id?: string | null
          reported_user_id?: string | null
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          report_type?: Database["public"]["Enums"]["report_type"]
          reported_product_id?: string | null
          reported_user_id?: string | null
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          alert_enabled: boolean | null
          alert_frequency: string | null
          category_id: string | null
          created_at: string
          filters: Json | null
          id: string
          last_alerted_at: string | null
          location_filters: Json | null
          price_range_max: number | null
          price_range_min: number | null
          search_name: string
          search_query: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_enabled?: boolean | null
          alert_frequency?: string | null
          category_id?: string | null
          created_at?: string
          filters?: Json | null
          id?: string
          last_alerted_at?: string | null
          location_filters?: Json | null
          price_range_max?: number | null
          price_range_min?: number | null
          search_name: string
          search_query?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_enabled?: boolean | null
          alert_frequency?: string | null
          category_id?: string | null
          created_at?: string
          filters?: Json | null
          id?: string
          last_alerted_at?: string | null
          location_filters?: Json | null
          price_range_max?: number | null
          price_range_min?: number | null
          search_name?: string
          search_query?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_ratings: {
        Row: {
          accuracy_rating: number | null
          buyer_id: string
          communication_rating: number | null
          created_at: string
          delivery_rating: number | null
          id: string
          is_verified_purchase: boolean | null
          product_id: string | null
          rating: number
          response_from_seller: string | null
          review_content: string | null
          review_title: string | null
          seller_id: string
          updated_at: string
        }
        Insert: {
          accuracy_rating?: number | null
          buyer_id: string
          communication_rating?: number | null
          created_at?: string
          delivery_rating?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          product_id?: string | null
          rating: number
          response_from_seller?: string | null
          review_content?: string | null
          review_title?: string | null
          seller_id: string
          updated_at?: string
        }
        Update: {
          accuracy_rating?: number | null
          buyer_id?: string
          communication_rating?: number | null
          created_at?: string
          delivery_rating?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          product_id?: string | null
          rating?: number
          response_from_seller?: string | null
          review_content?: string | null
          review_title?: string | null
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_ratings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          duration_days: number
          featured_ads_included: number | null
          features: Json
          id: string
          is_active: boolean | null
          max_ads: number | null
          max_images_per_ad: number | null
          name: string
          price: number
          priority_support: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          duration_days: number
          featured_ads_included?: number | null
          features: Json
          id?: string
          is_active?: boolean | null
          max_ads?: number | null
          max_images_per_ad?: number | null
          name: string
          price: number
          priority_support?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          duration_days?: number
          featured_ads_included?: number | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_ads?: number | null
          max_images_per_ad?: number | null
          name?: string
          price?: number
          priority_support?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      user_bans: {
        Row: {
          banned_at: string
          banned_by: string
          expires_at: string | null
          id: string
          is_permanent: boolean
          reason: string | null
          user_id: string
        }
        Insert: {
          banned_at?: string
          banned_by: string
          expires_at?: string | null
          id?: string
          is_permanent?: boolean
          reason?: string | null
          user_id: string
        }
        Update: {
          banned_at?: string
          banned_by?: string
          expires_at?: string | null
          id?: string
          is_permanent?: boolean
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_trusted: boolean | null
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_trusted?: boolean | null
          session_token: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_trusted?: boolean | null
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          auto_renewal: boolean | null
          created_at: string
          expires_at: string
          id: string
          payment_reference: string | null
          plan_id: string
          starts_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renewal?: boolean | null
          created_at?: string
          expires_at: string
          id?: string
          payment_reference?: string | null
          plan_id: string
          starts_at: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renewal?: boolean | null
          created_at?: string
          expires_at?: string
          id?: string
          payment_reference?: string | null
          plan_id?: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_verifications: {
        Row: {
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
          verification_data: Json | null
          verification_type: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
          verification_data?: Json | null
          verification_type: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
          verification_data?: Json | null
          verification_type?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_conversation_for_product: {
        Args: { product_uuid: string; user_one: string; user_two: string }
        Returns: string
      }
      get_conversation_participants: {
        Args: { conversation_uuid: string }
        Returns: {
          user_id: string
        }[]
      }
      get_premium_ad_info: {
        Args: { product_uuid: string }
        Returns: {
          ad_type: Database["public"]["Enums"]["premium_ad_type"]
          expires_at: string
        }[]
      }
      has_active_premium_ad: {
        Args: {
          product_uuid: string
          ad_type_filter?: Database["public"]["Enums"]["premium_ad_type"]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_conversation_participant: {
        Args: { conversation_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_current_user_participant: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      is_user_banned: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_user_blocked: {
        Args: { blocker_uuid: string; blocked_uuid: string }
        Returns: boolean
      }
      make_user_admin: {
        Args: { _user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      premium_ad_type: "featured" | "bump" | "vip" | "spotlight"
      product_status: "pending" | "approved" | "rejected" | "flagged"
      report_status: "pending" | "reviewed" | "resolved" | "dismissed"
      report_type:
        | "inappropriate_content"
        | "spam"
        | "harassment"
        | "fraud"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      premium_ad_type: ["featured", "bump", "vip", "spotlight"],
      product_status: ["pending", "approved", "rejected", "flagged"],
      report_status: ["pending", "reviewed", "resolved", "dismissed"],
      report_type: [
        "inappropriate_content",
        "spam",
        "harassment",
        "fraud",
        "other",
      ],
    },
  },
} as const
