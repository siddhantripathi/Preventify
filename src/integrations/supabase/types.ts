export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: string | null
          id: string
          ip_address: string | null
          resource_id: string
          resource_type: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: string | null
          id?: string
          ip_address?: string | null
          resource_id: string
          resource_type: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: string | null
          id?: string
          ip_address?: string | null
          resource_id?: string
          resource_type?: string
          user_id?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          brand_name: string
          created_at: string
          id: string
          medication_id: string
        }
        Insert: {
          brand_name: string
          created_at?: string
          id?: string
          medication_id: string
        }
        Update: {
          brand_name?: string
          created_at?: string
          id?: string
          medication_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          generic_name: string
          id: string
          salt_id: string | null
        }
        Insert: {
          created_at?: string
          generic_name: string
          id?: string
          salt_id?: string | null
        }
        Update: {
          created_at?: string
          generic_name?: string
          id?: string
          salt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_salt_id_fkey"
            columns: ["salt_id"]
            isOneToOne: false
            referencedRelation: "salts"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: number
          complaints: string | null
          created_at: string | null
          doctor_notes: string | null
          doctorid: string | null
          gender: string
          history: string | null
          id: string
          locationid: string
          mobile: string | null
          name: string
          status: string | null
          uhid: string
          updated_at: string | null
          visittag: string | null
          vitals: Json | null
        }
        Insert: {
          age: number
          complaints?: string | null
          created_at?: string | null
          doctor_notes?: string | null
          doctorid?: string | null
          gender: string
          history?: string | null
          id?: string
          locationid: string
          mobile?: string | null
          name: string
          status?: string | null
          uhid: string
          updated_at?: string | null
          visittag?: string | null
          vitals?: Json | null
        }
        Update: {
          age?: number
          complaints?: string | null
          created_at?: string | null
          doctor_notes?: string | null
          doctorid?: string | null
          gender?: string
          history?: string | null
          id?: string
          locationid?: string
          mobile?: string | null
          name?: string
          status?: string | null
          uhid?: string
          updated_at?: string | null
          visittag?: string | null
          vitals?: Json | null
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          created_at: string | null
          diagnoses: string[]
          doctorid: string
          id: string
          medications: Json[] | null
          notes: string | null
          patientid: string | null
        }
        Insert: {
          created_at?: string | null
          diagnoses: string[]
          doctorid: string
          id?: string
          medications?: Json[] | null
          notes?: string | null
          patientid?: string | null
        }
        Update: {
          created_at?: string | null
          diagnoses?: string[]
          doctorid?: string
          id?: string
          medications?: Json[] | null
          notes?: string | null
          patientid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_patientid_fkey"
            columns: ["patientid"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      salts: {
        Row: {
          created_at: string
          id: string
          salt_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          salt_name: string
        }
        Update: {
          created_at?: string
          id?: string
          salt_name?: string
        }
        Relationships: []
      }
      user_locations: {
        Row: {
          created_at: string | null
          id: string
          location_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          name: string
          openai_api_key: string | null
          role: string
          specialization: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          openai_api_key?: string | null
          role: string
          specialization?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          openai_api_key?: string | null
          role?: string
          specialization?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
