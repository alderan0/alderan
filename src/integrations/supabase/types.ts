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
      habits: {
        Row: {
          created_at: string
          id: string
          last_completed: string | null
          name: string
          streak: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_completed?: string | null
          name: string
          streak?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_completed?: string | null
          name?: string
          streak?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      project_tasks: {
        Row: {
          completed: boolean | null
          created_at: string
          deadline_date: string | null
          deadline_time: string | null
          description: string | null
          difficulty: number | null
          estimated_time: number | null
          id: string
          mood: string | null
          project_id: string
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          deadline_date?: string | null
          deadline_time?: string | null
          description?: string | null
          difficulty?: number | null
          estimated_time?: number | null
          id?: string
          mood?: string | null
          project_id: string
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          deadline_date?: string | null
          deadline_time?: string | null
          description?: string | null
          difficulty?: number | null
          estimated_time?: number | null
          id?: string
          mood?: string | null
          project_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          completed: boolean | null
          created_at: string
          deadline_date: string | null
          deadline_time: string | null
          description: string | null
          difficulty: number | null
          estimated_time: number | null
          id: string
          mood: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          deadline_date?: string | null
          deadline_time?: string | null
          description?: string | null
          difficulty?: number | null
          estimated_time?: number | null
          id?: string
          mood?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          deadline_date?: string | null
          deadline_time?: string | null
          description?: string | null
          difficulty?: number | null
          estimated_time?: number | null
          id?: string
          mood?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          ai_difficulty: number | null
          completed: boolean | null
          created_at: string
          deadline_date: string | null
          deadline_time: string | null
          description: string | null
          difficulty: number | null
          estimated_time: number | null
          id: string
          mood: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_difficulty?: number | null
          completed?: boolean | null
          created_at?: string
          deadline_date?: string | null
          deadline_time?: string | null
          description?: string | null
          difficulty?: number | null
          estimated_time?: number | null
          id?: string
          mood?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_difficulty?: number | null
          completed?: boolean | null
          created_at?: string
          deadline_date?: string | null
          deadline_time?: string | null
          description?: string | null
          difficulty?: number | null
          estimated_time?: number | null
          id?: string
          mood?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          acquired_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          tool_type: string
          user_id: string
        }
        Insert: {
          acquired_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tool_type: string
          user_id: string
        }
        Update: {
          acquired_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tool_type?: string
          user_id?: string
        }
        Relationships: []
      }
      trees: {
        Row: {
          created_at: string
          growth_stage: string | null
          height: number | null
          id: string
          leaves: number | null
          level: number | null
          level_status: string | null
          points: number | null
          tasks_completed: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          growth_stage?: string | null
          height?: number | null
          id?: string
          leaves?: number | null
          level?: number | null
          level_status?: string | null
          points?: number | null
          tasks_completed?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          growth_stage?: string | null
          height?: number | null
          id?: string
          leaves?: number | null
          level?: number | null
          level_status?: string | null
          points?: number | null
          tasks_completed?: number | null
          updated_at?: string
          user_id?: string
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
