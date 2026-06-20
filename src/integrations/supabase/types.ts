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
      announcements: {
        Row: {
          body: string
          created_at: string
          id: string
          target_role: Database["public"]["Enums"]["app_role"] | null
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          target_role?: Database["public"]["Enums"]["app_role"] | null
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          target_role?: Database["public"]["Enums"]["app_role"] | null
          title?: string
        }
        Relationships: []
      }
      app_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          cover_letter: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          posting_id: string | null
          resume_url: string | null
          status: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          posting_id?: string | null
          resume_url?: string | null
          status?: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          posting_id?: string | null
          resume_url?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_posting_id_fkey"
            columns: ["posting_id"]
            isOneToOne: false
            referencedRelation: "career_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      career_postings: {
        Row: {
          created_at: string
          department: string
          description: string
          employment_type: string | null
          id: string
          is_active: boolean
          location: string | null
          title: string
        }
        Insert: {
          created_at?: string
          department: string
          description: string
          employment_type?: string | null
          id?: string
          is_active?: boolean
          location?: string | null
          title: string
        }
        Update: {
          created_at?: string
          department?: string
          description?: string
          employment_type?: string | null
          id?: string
          is_active?: boolean
          location?: string | null
          title?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department: string | null
          email: string
          full_name: string
          hired_at: string
          id: string
          job_title: string
          notes: string | null
          pay_rate: number | null
          pay_type: string | null
          status: string
          terminated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          hired_at?: string
          id?: string
          job_title: string
          notes?: string | null
          pay_rate?: number | null
          pay_type?: string | null
          status?: string
          terminated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          hired_at?: string
          id?: string
          job_title?: string
          notes?: string | null
          pay_rate?: number | null
          pay_type?: string | null
          status?: string
          terminated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount_cents: number
          category: string
          created_at: string
          description: string | null
          id: string
          receipt_url: string | null
          spent_on: string
          vendor: string | null
        }
        Insert: {
          amount_cents: number
          category: string
          created_at?: string
          description?: string | null
          id?: string
          receipt_url?: string | null
          spent_on?: string
          vendor?: string | null
        }
        Update: {
          amount_cents?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          receipt_url?: string | null
          spent_on?: string
          vendor?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          inventory: number | null
          is_active: boolean
          name: string
          price_cents: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          inventory?: number | null
          is_active?: boolean
          name: string
          price_cents: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          inventory?: number | null
          is_active?: boolean
          name?: string
          price_cents?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          customer_email: string | null
          id: string
          notes: string | null
          payment_method: string | null
          product_id: string | null
          product_name: string
          quantity: number
          sold_at: string
          state_code: string | null
          tax_cents: number
          total_cents: number
          unit_price_cents: number
        }
        Insert: {
          customer_email?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          sold_at?: string
          state_code?: string | null
          tax_cents?: number
          total_cents: number
          unit_price_cents: number
        }
        Update: {
          customer_email?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          sold_at?: string
          state_code?: string | null
          tax_cents?: number
          total_cents?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "marketer" | "sales" | "employee" | "applicant"
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
      app_role: ["owner", "marketer", "sales", "employee", "applicant"],
    },
  },
} as const
