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
      collecte: {
        Row: {
          collecte_nb_casier_75_plein: number
          collecte_nb_palox_plein: number
          created_at: string
          id: number
          livraison_nb_casier_75_vide: number
          livraison_nb_palox_vide: number
          point_de_collecte_id: number
          tournee_id: number | null
        }
        Insert: {
          collecte_nb_casier_75_plein?: number
          collecte_nb_palox_plein?: number
          created_at?: string
          id?: number
          livraison_nb_casier_75_vide?: number
          livraison_nb_palox_vide?: number
          point_de_collecte_id: number
          tournee_id?: number | null
        }
        Update: {
          collecte_nb_casier_75_plein?: number
          collecte_nb_palox_plein?: number
          created_at?: string
          id?: number
          livraison_nb_casier_75_vide?: number
          livraison_nb_palox_vide?: number
          point_de_collecte_id?: number
          tournee_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collecte_point_de_collecte_id_fkey"
            columns: ["point_de_collecte_id"]
            isOneToOne: false
            referencedRelation: "point_de_collecte"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collecte_tournee_id_fkey"
            columns: ["tournee_id"]
            isOneToOne: false
            referencedRelation: "tournee"
            referencedColumns: ["id"]
          },
        ]
      }
      point_de_collecte: {
        Row: {
          adresse: string
          contacts: string[]
          created_at: string
          emails: string[]
          horaires: string | null
          id: number
          info: string | null
          latitude: number | null
          longitude: number | null
          nom: string
          setup_date: string | null
          telephones: string[]
          type: Database["public"]["Enums"]["point_de_collecte_type"]
        }
        Insert: {
          adresse: string
          contacts?: string[]
          created_at?: string
          emails?: string[]
          horaires?: string | null
          id?: number
          info?: string | null
          latitude?: number | null
          longitude?: number | null
          nom: string
          setup_date?: string | null
          telephones?: string[]
          type: Database["public"]["Enums"]["point_de_collecte_type"]
        }
        Update: {
          adresse?: string
          contacts?: string[]
          created_at?: string
          emails?: string[]
          horaires?: string | null
          id?: number
          info?: string | null
          latitude?: number | null
          longitude?: number | null
          nom?: string
          setup_date?: string | null
          telephones?: string[]
          type?: Database["public"]["Enums"]["point_de_collecte_type"]
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      tournee: {
        Row: {
          created_at: string
          date: string
          id: number
          point_de_massification_id: number
          transporteur_id: number
          zone: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: number
          point_de_massification_id: number
          transporteur_id: number
          zone?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: number
          point_de_massification_id?: number
          transporteur_id?: number
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournee_point_de_massification_id_fkey"
            columns: ["point_de_massification_id"]
            isOneToOne: false
            referencedRelation: "point_de_collecte"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournee_transporteur_id_fkey"
            columns: ["transporteur_id"]
            isOneToOne: false
            referencedRelation: "transporteur"
            referencedColumns: ["id"]
          },
        ]
      }
      transporteur: {
        Row: {
          created_at: string
          entrepot_id: number | null
          id: number
          nom: string
        }
        Insert: {
          created_at?: string
          entrepot_id?: number | null
          id?: number
          nom: string
        }
        Update: {
          created_at?: string
          entrepot_id?: number | null
          id?: number
          nom?: string
        }
        Relationships: [
          {
            foreignKeyName: "Transporteur_entrepot_id_fkey"
            columns: ["entrepot_id"]
            isOneToOne: false
            referencedRelation: "point_de_collecte"
            referencedColumns: ["id"]
          },
        ]
      }
      transporteur_users: {
        Row: {
          created_at: string
          id: number
          transporteur_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          transporteur_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          transporteur_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transporter_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transporteur_users_transporteur_id_fkey"
            columns: ["transporteur_id"]
            isOneToOne: false
            referencedRelation: "transporteur"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string
        }
        Insert: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id: string
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      set_role: {
        Args: {
          event: Json
        }
        Returns: Json
      }
    }
    Enums: {
      app_permission:
        | "point_de_collecte.select"
        | "point_de_collecte.insert"
        | "point_de_collecte.update"
        | "point_de_collecte.delete"
        | "tournee.select"
        | "tournee.insert"
        | "tournee.update"
        | "tournee.delete"
        | "collecte.select"
        | "collecte.insert"
        | "collecte.update"
        | "collecte.delete"
        | "transporteur.select"
        | "transporteur.insert"
        | "transporteur.update"
        | "transporteur.delete"
        | "transporteur_users.select"
        | "transporteur_users.update"
        | "transporteur_users.insert"
        | "transporteur_users.delete"
      app_role: "staff" | "transporteur"
      point_de_collecte_type: "Magasin" | "Producteur" | "Massification"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
