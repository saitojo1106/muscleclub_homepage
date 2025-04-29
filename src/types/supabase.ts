export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: number
          title: string
          date: string
          location: string
          description: string | null
          requirements: string | null
          fee: string | null
          image_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          title: string
          date: string
          location: string
          description?: string | null
          requirements?: string | null
          fee?: string | null
          image_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          date?: string
          location?: string
          description?: string | null
          requirements?: string | null
          fee?: string | null
          image_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      members: {
        Row: {
          id: number
          name: string
          position: string
          year: string | null
          speciality: string | null
          message: string | null
          records: string | null
          instagram: string | null
          image: string | null
          order_index: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          position: string
          year?: string | null
          speciality?: string | null
          message?: string | null
          records?: string | null
          instagram?: string | null
          image?: string | null
          order_index?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          position?: string
          year?: string | null
          speciality?: string | null
          message?: string | null
          records?: string | null
          instagram?: string | null
          image?: string | null
          order_index?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
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
  }
}

