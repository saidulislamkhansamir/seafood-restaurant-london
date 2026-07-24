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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      banned_users: {
        Row: {
          banned_at: string
          reason: string | null
          user_id: string
        }
        Insert: {
          banned_at?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          banned_at?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      info_reports: {
        Row: {
          created_at: string
          id: string
          message: string
          restaurant_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          restaurant_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          restaurant_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "info_reports_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_claims: {
        Row: {
          contact_email: string
          contact_name: string
          created_at: string
          id: string
          message: string | null
          restaurant_id: string
          status: string
          token_expires_at: string | null
          user_id: string
          verification_token: string | null
        }
        Insert: {
          contact_email: string
          contact_name: string
          created_at?: string
          id?: string
          message?: string | null
          restaurant_id: string
          status?: string
          token_expires_at?: string | null
          user_id: string
          verification_token?: string | null
        }
        Update: {
          contact_email?: string
          contact_name?: string
          created_at?: string
          id?: string
          message?: string | null
          restaurant_id?: string
          status?: string
          token_expires_at?: string | null
          user_id?: string
          verification_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_claims_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          borough: string | null
          id: string
          name: string
          postcode_district: string | null
          slug: string
        }
        Insert: {
          borough?: string | null
          id?: string
          name: string
          postcode_district?: string | null
          slug: string
        }
        Update: {
          borough?: string | null
          id?: string
          name?: string
          postcode_district?: string | null
          slug?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      photo_submissions: {
        Row: {
          created_at: string
          id: string
          restaurant_id: string
          status: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          restaurant_id: string
          status?: string
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          restaurant_id?: string
          status?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_submissions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_edit_requests: {
        Row: {
          admin_note: string | null
          changes: Json
          created_at: string
          id: string
          restaurant_id: string
          reviewed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          changes: Json
          created_at?: string
          id?: string
          restaurant_id: string
          reviewed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          changes?: Json
          created_at?: string
          id?: string
          restaurant_id?: string
          reviewed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_edit_requests_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_photos: {
        Row: {
          created_at: string
          id: string
          restaurant_id: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          restaurant_id: string
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          restaurant_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_photos_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          attributes: string[] | null
          booking_link: string | null
          borough: string | null
          created_at: string | null
          cuisine_tags: string[] | null
          delivery_platforms: string[] | null
          description: string | null
          email: string | null
          full_address: string | null
          google_maps_url: string | null
          has_booking: boolean | null
          has_delivery: boolean | null
          has_website: boolean | null
          id: string
          is_featured: boolean | null
          is_premium: boolean | null
          lat: number | null
          latest_review_date: string | null
          listing_status: string | null
          lng: number | null
          location_area: string | null
          member_discount: string | null
          menu_link: string | null
          name: string
          nearby_parking: Json | null
          nearby_stations: Json | null
          opening_hours: string | null
          opening_hours_checked_at: string | null
          owner_claimed: boolean
          phone: string | null
          photo_url: string | null
          photos_count: number | null
          postcode: string | null
          postcode_district: string | null
          price_range: string | null
          primary_category: string | null
          rating: number | null
          review_count: number | null
          slug: string
          social_links: Json | null
          specialities: string | null
          subcategories: string[] | null
          updated_at: string | null
          verified: boolean | null
          website_url: string | null
        }
        Insert: {
          attributes?: string[] | null
          booking_link?: string | null
          borough?: string | null
          created_at?: string | null
          cuisine_tags?: string[] | null
          delivery_platforms?: string[] | null
          description?: string | null
          email?: string | null
          full_address?: string | null
          google_maps_url?: string | null
          has_booking?: boolean | null
          has_delivery?: boolean | null
          has_website?: boolean | null
          id?: string
          is_featured?: boolean | null
          is_premium?: boolean | null
          lat?: number | null
          latest_review_date?: string | null
          listing_status?: string | null
          lng?: number | null
          location_area?: string | null
          member_discount?: string | null
          menu_link?: string | null
          name: string
          nearby_parking?: Json | null
          nearby_stations?: Json | null
          opening_hours?: string | null
          opening_hours_checked_at?: string | null
          owner_claimed?: boolean
          phone?: string | null
          photo_url?: string | null
          photos_count?: number | null
          postcode?: string | null
          postcode_district?: string | null
          price_range?: string | null
          primary_category?: string | null
          rating?: number | null
          review_count?: number | null
          slug: string
          social_links?: Json | null
          specialities?: string | null
          subcategories?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
          website_url?: string | null
        }
        Update: {
          attributes?: string[] | null
          booking_link?: string | null
          borough?: string | null
          created_at?: string | null
          cuisine_tags?: string[] | null
          delivery_platforms?: string[] | null
          description?: string | null
          email?: string | null
          full_address?: string | null
          google_maps_url?: string | null
          has_booking?: boolean | null
          has_delivery?: boolean | null
          has_website?: boolean | null
          id?: string
          is_featured?: boolean | null
          is_premium?: boolean | null
          lat?: number | null
          latest_review_date?: string | null
          listing_status?: string | null
          lng?: number | null
          location_area?: string | null
          member_discount?: string | null
          menu_link?: string | null
          name?: string
          nearby_parking?: Json | null
          nearby_stations?: Json | null
          opening_hours?: string | null
          opening_hours_checked_at?: string | null
          owner_claimed?: boolean
          phone?: string | null
          photo_url?: string | null
          photos_count?: number | null
          postcode?: string | null
          postcode_district?: string | null
          price_range?: string | null
          primary_category?: string | null
          rating?: number | null
          review_count?: number | null
          slug?: string
          social_links?: Json | null
          specialities?: string | null
          subcategories?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
          website_url?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          restaurant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          restaurant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          restaurant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_restaurants: {
        Row: {
          created_at: string
          restaurant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          restaurant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          restaurant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_restaurants_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          address: string | null
          category: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: string
          message: string | null
          phone: string | null
          photo_storage_path: string | null
          restaurant_name: string
          status: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          photo_storage_path?: string | null
          restaurant_name: string
          status?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          photo_storage_path?: string | null
          restaurant_name?: string
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_approve_claim: { Args: { p_claim_id: string }; Returns: undefined }
      admin_approve_submission: {
        Args: { p_submission_id: string }
        Returns: string
      }
      admin_ban_user: {
        Args: { p_reason?: string; p_user_id: string }
        Returns: undefined
      }
      admin_list_claims: {
        Args: { p_status?: string }
        Returns: {
          contact_email: string
          contact_name: string
          created_at: string
          id: string
          message: string
          restaurant_id: string
          restaurant_name: string
          restaurant_slug: string
          status: string
          user_id: string
        }[]
      }
      admin_list_edit_requests: {
        Args: { p_status?: string }
        Returns: {
          admin_note: string
          changes: Json
          created_at: string
          id: string
          restaurant_id: string
          restaurant_name: string
          restaurant_slug: string
          reviewed_at: string
          status: string
          user_email: string
          user_id: string
        }[]
      }
      admin_list_info_reports: {
        Args: { p_status?: string }
        Returns: {
          created_at: string
          id: string
          message: string
          restaurant_id: string
          restaurant_name: string
          restaurant_slug: string
          status: string
        }[]
      }
      admin_list_recent_photos: {
        Args: { p_limit?: number }
        Returns: {
          created_at: string
          id: string
          is_current_hero: boolean
          restaurant_id: string
          restaurant_name: string
          restaurant_slug: string
          storage_path: string
        }[]
      }
      admin_list_submissions: {
        Args: { p_status?: string }
        Returns: {
          address: string | null
          category: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: string
          message: string | null
          phone: string | null
          photo_storage_path: string | null
          restaurant_name: string
          status: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "submissions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_reject_claim: { Args: { p_claim_id: string }; Returns: undefined }
      admin_reject_submission: {
        Args: { p_submission_id: string }
        Returns: undefined
      }
      admin_remove_photo: {
        Args: { p_restaurant_id: string; p_storage_path: string }
        Returns: undefined
      }
      admin_resolve_info_report: {
        Args: { p_dismiss?: boolean; p_report_id: string }
        Returns: undefined
      }
      admin_review_edit_request: {
        Args: {
          p_admin_note?: string
          p_approve: boolean
          p_request_id: string
        }
        Returns: undefined
      }
      admin_search_restaurants: {
        Args: { p_query: string }
        Returns: {
          attributes: string[] | null
          booking_link: string | null
          borough: string | null
          created_at: string | null
          cuisine_tags: string[] | null
          delivery_platforms: string[] | null
          description: string | null
          email: string | null
          full_address: string | null
          google_maps_url: string | null
          has_booking: boolean | null
          has_delivery: boolean | null
          has_website: boolean | null
          id: string
          is_featured: boolean | null
          is_premium: boolean | null
          lat: number | null
          latest_review_date: string | null
          listing_status: string | null
          lng: number | null
          location_area: string | null
          member_discount: string | null
          menu_link: string | null
          name: string
          nearby_parking: Json | null
          nearby_stations: Json | null
          opening_hours: string | null
          opening_hours_checked_at: string | null
          owner_claimed: boolean
          phone: string | null
          photo_url: string | null
          photos_count: number | null
          postcode: string | null
          postcode_district: string | null
          price_range: string | null
          primary_category: string | null
          rating: number | null
          review_count: number | null
          slug: string
          social_links: Json | null
          specialities: string | null
          subcategories: string[] | null
          updated_at: string | null
          verified: boolean | null
          website_url: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "restaurants"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_search_users: {
        Args: { p_query: string }
        Returns: {
          ban_reason: string
          banned: boolean
          created_at: string
          email: string
          id: string
        }[]
      }
      admin_set_listing_status: {
        Args: { p_restaurant_id: string; p_status: string }
        Returns: undefined
      }
      admin_set_member_discount: {
        Args: { p_member_discount: string; p_restaurant_id: string }
        Returns: undefined
      }
      admin_unban_user: { Args: { p_user_id: string }; Returns: undefined }
      admin_update_restaurant: {
        Args: { p_fields: Json; p_restaurant_id: string }
        Returns: undefined
      }
      claim_restaurant_photo: {
        Args: { p_restaurant_id: string; p_storage_path: string }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_banned: { Args: never; Returns: boolean }
      my_claimed_restaurants: {
        Args: never
        Returns: {
          attributes: string[] | null
          booking_link: string | null
          borough: string | null
          created_at: string | null
          cuisine_tags: string[] | null
          delivery_platforms: string[] | null
          description: string | null
          email: string | null
          full_address: string | null
          google_maps_url: string | null
          has_booking: boolean | null
          has_delivery: boolean | null
          has_website: boolean | null
          id: string
          is_featured: boolean | null
          is_premium: boolean | null
          lat: number | null
          latest_review_date: string | null
          listing_status: string | null
          lng: number | null
          location_area: string | null
          member_discount: string | null
          menu_link: string | null
          name: string
          nearby_parking: Json | null
          nearby_stations: Json | null
          opening_hours: string | null
          opening_hours_checked_at: string | null
          owner_claimed: boolean
          phone: string | null
          photo_url: string | null
          photos_count: number | null
          postcode: string | null
          postcode_district: string | null
          price_range: string | null
          primary_category: string | null
          rating: number | null
          review_count: number | null
          slug: string
          social_links: Json | null
          specialities: string | null
          subcategories: string[] | null
          updated_at: string | null
          verified: boolean | null
          website_url: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "restaurants"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      submit_edit_request: {
        Args: { p_changes: Json; p_restaurant_id: string }
        Returns: string
      }
      submit_listing_claim: {
        Args: {
          p_contact_email: string
          p_contact_name: string
          p_message: string
          p_restaurant_id: string
        }
        Returns: {
          claim_id: string
          needs_email_verification: boolean
          restaurant_email: string
          restaurant_name: string
          verify_token: string
        }[]
      }
      verify_listing_claim: { Args: { p_token: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
