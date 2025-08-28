export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ad_analytics: {
        Row: {
          browser: string | null
          conversion_type: string | null
          conversion_value: number | null
          created_at: string
          device_type: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          location_data: Json | null
          product_id: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          conversion_type?: string | null
          conversion_value?: number | null
          created_at?: string
          device_type?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          location_data?: Json | null
          product_id: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          conversion_type?: string | null
          conversion_value?: number | null
          created_at?: string
          device_type?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          location_data?: Json | null
          product_id?: string
          referrer?: string | null
          session_id?: string | null
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
      ad_geographic_targeting: {
        Row: {
          city: string | null
          coordinates: unknown | null
          created_at: string
          id: string
          premium_ad_id: string | null
          radius_km: number | null
          region: string
        }
        Insert: {
          city?: string | null
          coordinates?: unknown | null
          created_at?: string
          id?: string
          premium_ad_id?: string | null
          radius_km?: number | null
          region: string
        }
        Update: {
          city?: string | null
          coordinates?: unknown | null
          created_at?: string
          id?: string
          premium_ad_id?: string | null
          radius_km?: number | null
          region?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_geographic_targeting_premium_ad_id_fkey"
            columns: ["premium_ad_id"]
            isOneToOne: false
            referencedRelation: "premium_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      auto_renewal_settings: {
        Row: {
          ad_type: Database["public"]["Enums"]["premium_ad_type"]
          created_at: string
          current_renewals: number
          id: string
          is_enabled: boolean
          max_renewals: number | null
          product_id: string
          renewal_frequency: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_type: Database["public"]["Enums"]["premium_ad_type"]
          created_at?: string
          current_renewals?: number
          id?: string
          is_enabled?: boolean
          max_renewals?: number | null
          product_id: string
          renewal_frequency?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ad_type?: Database["public"]["Enums"]["premium_ad_type"]
          created_at?: string
          current_renewals?: number
          id?: string
          is_enabled?: boolean
          max_renewals?: number | null
          product_id?: string
          renewal_frequency?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_renewal_settings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          parent_comment_id: string | null
          post_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          comments_enabled: boolean | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          likes_count: number | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          reading_time: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          comments_enabled?: boolean | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          likes_count?: number | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          comments_enabled?: boolean | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          likes_count?: number | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      bulk_promotion_packages: {
        Row: {
          ad_count: number
          created_at: string
          discount_percentage: number | null
          duration_days: number
          features: Json
          id: string
          is_active: boolean | null
          name: string
          package_type: string
          total_price: number
          updated_at: string
        }
        Insert: {
          ad_count: number
          created_at?: string
          discount_percentage?: number | null
          duration_days: number
          features?: Json
          id?: string
          is_active?: boolean | null
          name: string
          package_type: string
          total_price: number
          updated_at?: string
        }
        Update: {
          ad_count?: number
          created_at?: string
          discount_percentage?: number | null
          duration_days?: number
          features?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          package_type?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: []
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
      business_inventory: {
        Row: {
          auto_renewal_enabled: boolean
          business_id: string
          created_at: string
          id: string
          low_stock_threshold: number
          product_id: string
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          auto_renewal_enabled?: boolean
          business_id: string
          created_at?: string
          id?: string
          low_stock_threshold?: number
          product_id: string
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          auto_renewal_enabled?: boolean
          business_id?: string
          created_at?: string
          id?: string
          low_stock_threshold?: number
          product_id?: string
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_inventory_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      business_settings: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      cms_pages: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          is_published: boolean
          meta_description: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_translations: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          field_name: string
          id: string
          is_approved: boolean | null
          language_code: string
          translated_content: string
          translator_id: string | null
          updated_at: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          field_name: string
          id?: string
          is_approved?: boolean | null
          language_code: string
          translated_content: string
          translator_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          field_name?: string
          id?: string
          is_approved?: boolean | null
          language_code?: string
          translated_content?: string
          translator_id?: string | null
          updated_at?: string | null
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
      currency_rates: {
        Row: {
          base_currency: string
          exchange_rate: number
          id: string
          target_currency: string
          updated_at: string | null
        }
        Insert: {
          base_currency?: string
          exchange_rate: number
          id?: string
          target_currency: string
          updated_at?: string | null
        }
        Update: {
          base_currency?: string
          exchange_rate?: number
          id?: string
          target_currency?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      location_hierarchy: {
        Row: {
          child_location_id: string
          created_at: string | null
          hierarchy_level: number
          id: string
          parent_location_id: string | null
        }
        Insert: {
          child_location_id: string
          created_at?: string | null
          hierarchy_level?: number
          id?: string
          parent_location_id?: string | null
        }
        Update: {
          child_location_id?: string
          created_at?: string | null
          hierarchy_level?: number
          id?: string
          parent_location_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_hierarchy_child_location_id_fkey"
            columns: ["child_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_hierarchy_parent_location_id_fkey"
            columns: ["parent_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
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
      moderation_queue: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          moderator_id: string | null
          notes: string | null
          reason: string
          reporter_id: string | null
          reviewed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          moderator_id?: string | null
          notes?: string | null
          reason: string
          reporter_id?: string | null
          reviewed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          moderator_id?: string | null
          notes?: string | null
          reason?: string
          reporter_id?: string | null
          reviewed_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
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
      payment_methods: {
        Row: {
          configuration: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          provider: string
          type: string
          updated_at: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          provider: string
          type: string
          updated_at?: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          provider?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          external_reference: string | null
          fees: number | null
          gateway_response: Json | null
          id: string
          net_amount: number | null
          payment_data: Json | null
          payment_method_id: string | null
          reference_id: string | null
          refund_amount: number | null
          refund_reason: string | null
          status: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          external_reference?: string | null
          fees?: number | null
          gateway_response?: Json | null
          id?: string
          net_amount?: number | null
          payment_data?: Json | null
          payment_method_id?: string | null
          reference_id?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          status?: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          external_reference?: string | null
          fees?: number | null
          gateway_response?: Json | null
          id?: string
          net_amount?: number | null
          payment_data?: Json | null
          payment_method_id?: string | null
          reference_id?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
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
      product_qr_codes: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          qr_code_data: string
          qr_image_url: string | null
          scan_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          qr_code_data: string
          qr_image_url?: string | null
          scan_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          qr_code_data?: string
          qr_image_url?: string | null
          scan_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_qr_codes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
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
          phone_verification_attempts: number | null
          phone_verification_code: string | null
          phone_verification_expires_at: string | null
          phone_verified: boolean | null
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
          phone_verification_attempts?: number | null
          phone_verification_code?: string | null
          phone_verification_expires_at?: string | null
          phone_verified?: boolean | null
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
          phone_verification_attempts?: number | null
          phone_verification_code?: string | null
          phone_verification_expires_at?: string | null
          phone_verified?: boolean | null
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
      promotion_tiers: {
        Row: {
          boost_multiplier: number | null
          created_at: string
          duration_hours: number
          features: Json
          id: string
          is_active: boolean | null
          name: string
          price: number
          priority_score: number | null
          type: string
          updated_at: string
        }
        Insert: {
          boost_multiplier?: number | null
          created_at?: string
          duration_hours: number
          features?: Json
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          priority_score?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          boost_multiplier?: number | null
          created_at?: string
          duration_hours?: number
          features?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          priority_score?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          commission_rate: number | null
          created_at: string | null
          current_uses: number | null
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          commission_rate?: number | null
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          commission_rate?: number | null
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      referral_transactions: {
        Row: {
          commission_amount: number
          commission_status: string | null
          created_at: string | null
          id: string
          paid_at: string | null
          referee_id: string
          referral_code_id: string
          referrer_id: string
          transaction_id: string | null
        }
        Insert: {
          commission_amount: number
          commission_status?: string | null
          created_at?: string | null
          id?: string
          paid_at?: string | null
          referee_id: string
          referral_code_id: string
          referrer_id: string
          transaction_id?: string | null
        }
        Update: {
          commission_amount?: number
          commission_status?: string | null
          created_at?: string | null
          id?: string
          paid_at?: string | null
          referee_id?: string
          referral_code_id?: string
          referrer_id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_transactions_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
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
      revenue_shares: {
        Row: {
          advertiser_share: number | null
          commission_rate: number
          created_at: string
          id: string
          platform_share: number
          transaction_id: string | null
        }
        Insert: {
          advertiser_share?: number | null
          commission_rate: number
          created_at?: string
          id?: string
          platform_share: number
          transaction_id?: string | null
        }
        Update: {
          advertiser_share?: number | null
          commission_rate?: number
          created_at?: string
          id?: string
          platform_share?: number
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_shares_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_tracking: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payment_reference: string | null
          premium_ad_id: string | null
          product_id: string | null
          subscription_id: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payment_reference?: string | null
          premium_ad_id?: string | null
          product_id?: string | null
          subscription_id?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_reference?: string | null
          premium_ad_id?: string | null
          product_id?: string | null
          subscription_id?: string | null
          transaction_type?: string
          user_id?: string | null
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
      search_alerts: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_checked_at: string | null
          last_results_count: number | null
          new_results_count: number | null
          saved_search_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_checked_at?: string | null
          last_results_count?: number | null
          new_results_count?: number | null
          saved_search_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_checked_at?: string | null
          last_results_count?: number | null
          new_results_count?: number | null
          saved_search_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_alerts_saved_search_id_fkey"
            columns: ["saved_search_id"]
            isOneToOne: false
            referencedRelation: "saved_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      seasonal_campaigns: {
        Row: {
          created_at: string
          description: string | null
          discount_percentage: number | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          start_date: string
          target_categories: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          start_date: string
          target_categories?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
          target_categories?: Json | null
          updated_at?: string
        }
        Relationships: []
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
      social_shares: {
        Row: {
          blog_post_id: string | null
          id: string
          ip_address: unknown | null
          platform: string
          product_id: string | null
          shared_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          blog_post_id?: string | null
          id?: string
          ip_address?: unknown | null
          platform: string
          product_id?: string | null
          shared_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          blog_post_id?: string | null
          id?: string
          ip_address?: unknown | null
          platform?: string
          product_id?: string | null
          shared_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_shares_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_shares_product_id_fkey"
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
      subscription_usage: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          subscription_id: string
          usage_count: number | null
          usage_date: string | null
          usage_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          subscription_id: string
          usage_count?: number | null
          usage_date?: string | null
          usage_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          subscription_id?: string
          usage_count?: number | null
          usage_date?: string | null
          usage_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_usage_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
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
      user_package_purchases: {
        Row: {
          ads_remaining: number
          created_at: string
          expires_at: string
          id: string
          package_id: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          ads_remaining: number
          created_at?: string
          expires_at: string
          id?: string
          package_id?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          ads_remaining?: number
          created_at?: string
          expires_at?: string
          id?: string
          package_id?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_package_purchases_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "bulk_promotion_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_package_purchases_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
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
      user_verification_documents: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string
          expires_at: string | null
          id: string
          rejection_reason: string | null
          updated_at: string | null
          user_id: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url: string
          expires_at?: string | null
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string
          expires_at?: string | null
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
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
      generate_phone_verification_code: {
        Args: { phone_number: string; user_uuid: string }
        Returns: boolean
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
          ad_type_filter?: Database["public"]["Enums"]["premium_ad_type"]
          product_uuid: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
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
        Args: { blocked_uuid: string; blocker_uuid: string }
        Returns: boolean
      }
      make_user_admin: {
        Args: { _user_id: string }
        Returns: undefined
      }
      verify_phone_code: {
        Args: { input_code: string; user_uuid: string }
        Returns: boolean
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
