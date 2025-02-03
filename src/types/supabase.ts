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
          collecte_casier_33_plein_nb_palette: number
          collecte_casier_33_plein_palette_type:
            | Database["public"]["Enums"]["palette_type"]
            | null
          collecte_casier_75_plein_nb_palette: number
          collecte_casier_75_plein_palette_type:
            | Database["public"]["Enums"]["palette_type"]
            | null
          collecte_fut_nb_palette: number
          collecte_fut_palette_type:
            | Database["public"]["Enums"]["palette_type"]
            | null
          collecte_nb_bouteilles: number
          collecte_nb_casier_33_plein: number
          collecte_nb_casier_75_plein: number
          collecte_nb_fut_vide: number
          collecte_nb_palette_bouteille: number
          collecte_nb_palette_vide: number
          collecte_nb_palox_plein: number
          collecte_palette_vide_type:
            | Database["public"]["Enums"]["palette_type"]
            | null
          created_at: string
          cyke_id: string | null
          date: string | null
          id: number
          livraison_casier_33_vide_nb_palette: number
          livraison_casier_33_vide_palette_type:
            | Database["public"]["Enums"]["palette_type"]
            | null
          livraison_casier_75_vide_nb_palette: number
          livraison_casier_75_vide_palette_type:
            | Database["public"]["Enums"]["palette_type"]
            | null
          livraison_fut_nb_palette: number
          livraison_fut_palette_type:
            | Database["public"]["Enums"]["palette_type"]
            | null
          livraison_nb_casier_33_vide: number
          livraison_nb_casier_75_vide: number
          livraison_nb_fut_vide: number
          livraison_nb_palette_bouteille: number
          livraison_nb_palette_vide: number
          livraison_nb_palox_vide: number
          livraison_palette_vide_type:
            | Database["public"]["Enums"]["palette_type"]
            | null
          point_de_collecte_id: number
          tournee_id: number | null
        }
        Insert: {
          collecte_casier_33_plein_nb_palette?: number
          collecte_casier_33_plein_palette_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          collecte_casier_75_plein_nb_palette?: number
          collecte_casier_75_plein_palette_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          collecte_fut_nb_palette?: number
          collecte_fut_palette_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          collecte_nb_bouteilles?: number
          collecte_nb_casier_33_plein?: number
          collecte_nb_casier_75_plein?: number
          collecte_nb_fut_vide?: number
          collecte_nb_palette_bouteille?: number
          collecte_nb_palette_vide?: number
          collecte_nb_palox_plein?: number
          collecte_palette_vide_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          created_at?: string
          cyke_id?: string | null
          date?: string | null
          id?: number
          livraison_casier_33_vide_nb_palette?: number
          livraison_casier_33_vide_palette_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          livraison_casier_75_vide_nb_palette?: number
          livraison_casier_75_vide_palette_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          livraison_fut_nb_palette?: number
          livraison_fut_palette_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          livraison_nb_casier_33_vide?: number
          livraison_nb_casier_75_vide?: number
          livraison_nb_fut_vide?: number
          livraison_nb_palette_bouteille?: number
          livraison_nb_palette_vide?: number
          livraison_nb_palox_vide?: number
          livraison_palette_vide_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          point_de_collecte_id: number
          tournee_id?: number | null
        }
        Update: {
          collecte_casier_33_plein_nb_palette?: number
          collecte_casier_33_plein_palette_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          collecte_casier_75_plein_nb_palette?: number
          collecte_casier_75_plein_palette_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          collecte_fut_nb_palette?: number
          collecte_fut_palette_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          collecte_nb_bouteilles?: number
          collecte_nb_casier_33_plein?: number
          collecte_nb_casier_75_plein?: number
          collecte_nb_fut_vide?: number
          collecte_nb_palette_bouteille?: number
          collecte_nb_palette_vide?: number
          collecte_nb_palox_plein?: number
          collecte_palette_vide_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          created_at?: string
          cyke_id?: string | null
          date?: string | null
          id?: number
          livraison_casier_33_vide_nb_palette?: number
          livraison_casier_33_vide_palette_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          livraison_casier_75_vide_nb_palette?: number
          livraison_casier_75_vide_palette_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          livraison_fut_nb_palette?: number
          livraison_fut_palette_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
          livraison_nb_casier_33_vide?: number
          livraison_nb_casier_75_vide?: number
          livraison_nb_fut_vide?: number
          livraison_nb_palette_bouteille?: number
          livraison_nb_palette_vide?: number
          livraison_nb_palox_vide?: number
          livraison_palette_vide_type?:
            | Database["public"]["Enums"]["palette_type"]
            | null
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
      consigne: {
        Row: {
          consigne: number
          created_at: string
          date: string
          deconsigne: number
          id: number
          montant: number
          point_de_collecte_id: number | null
        }
        Insert: {
          consigne: number
          created_at?: string
          date: string
          deconsigne: number
          id?: number
          montant: number
          point_de_collecte_id?: number | null
        }
        Update: {
          consigne?: number
          created_at?: string
          date?: string
          deconsigne?: number
          id?: number
          montant?: number
          point_de_collecte_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "consigne_point_de_collecte_id_fkey"
            columns: ["point_de_collecte_id"]
            isOneToOne: false
            referencedRelation: "point_de_collecte"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_statut: {
        Row: {
          created_at: string
          email: string
          id: number
          mailing_id: number
          statut: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          mailing_id: number
          statut: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          mailing_id?: number
          statut?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_statut_mailing_id_fkey"
            columns: ["mailing_id"]
            isOneToOne: false
            referencedRelation: "mailing"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_template: {
        Row: {
          corps: string
          created_at: string
          id: number
          nom: string
          sujet: string
          variables: Json | null
        }
        Insert: {
          corps: string
          created_at?: string
          id?: number
          nom: string
          sujet: string
          variables?: Json | null
        }
        Update: {
          corps?: string
          created_at?: string
          id?: number
          nom?: string
          sujet?: string
          variables?: Json | null
        }
        Relationships: []
      }
      mailing: {
        Row: {
          created_at: string
          date_envoi: string | null
          id: number
          mail_template_id: number
          point_de_collecte_ids: number[] | null
          statut: Database["public"]["Enums"]["statut_mailing"]
          variables: Json | null
        }
        Insert: {
          created_at?: string
          date_envoi?: string | null
          id?: number
          mail_template_id: number
          point_de_collecte_ids?: number[] | null
          statut: Database["public"]["Enums"]["statut_mailing"]
          variables?: Json | null
        }
        Update: {
          created_at?: string
          date_envoi?: string | null
          id?: number
          mail_template_id?: number
          point_de_collecte_ids?: number[] | null
          statut?: Database["public"]["Enums"]["statut_mailing"]
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mailing_mail_template_id_fkey"
            columns: ["mail_template_id"]
            isOneToOne: false
            referencedRelation: "mail_template"
            referencedColumns: ["id"]
          },
        ]
      }
      point_de_collecte: {
        Row: {
          adresse: string
          collecte_par_id: number | null
          consigne: boolean
          contacts: string[]
          contenant_collecte_type:
            | Database["public"]["Enums"]["contenant_collecte_type"]
            | null
          created_at: string
          emails: string[]
          horaires: string | null
          id: number
          info: string | null
          latitude: number | null
          longitude: number | null
          nom: string
          setup_date: string | null
          statut: Database["public"]["Enums"]["point_de_collecte_statut"]
          stock_casiers_75: number | null
          stock_contenants: number | null
          stock_paloxs: number | null
          telephones: string[]
          type: Database["public"]["Enums"]["point_de_collecte_type"]
          zone_de_collecte_id: number | null
        }
        Insert: {
          adresse: string
          collecte_par_id?: number | null
          consigne?: boolean
          contacts?: string[]
          contenant_collecte_type?:
            | Database["public"]["Enums"]["contenant_collecte_type"]
            | null
          created_at?: string
          emails?: string[]
          horaires?: string | null
          id?: number
          info?: string | null
          latitude?: number | null
          longitude?: number | null
          nom: string
          setup_date?: string | null
          statut?: Database["public"]["Enums"]["point_de_collecte_statut"]
          stock_casiers_75?: number | null
          stock_contenants?: number | null
          stock_paloxs?: number | null
          telephones?: string[]
          type: Database["public"]["Enums"]["point_de_collecte_type"]
          zone_de_collecte_id?: number | null
        }
        Update: {
          adresse?: string
          collecte_par_id?: number | null
          consigne?: boolean
          contacts?: string[]
          contenant_collecte_type?:
            | Database["public"]["Enums"]["contenant_collecte_type"]
            | null
          created_at?: string
          emails?: string[]
          horaires?: string | null
          id?: number
          info?: string | null
          latitude?: number | null
          longitude?: number | null
          nom?: string
          setup_date?: string | null
          statut?: Database["public"]["Enums"]["point_de_collecte_statut"]
          stock_casiers_75?: number | null
          stock_contenants?: number | null
          stock_paloxs?: number | null
          telephones?: string[]
          type?: Database["public"]["Enums"]["point_de_collecte_type"]
          zone_de_collecte_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "point_de_collecte_collecte_par_id_fkey"
            columns: ["collecte_par_id"]
            isOneToOne: false
            referencedRelation: "point_de_collecte"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_de_collecte_zone_de_collecte_id_fkey"
            columns: ["zone_de_collecte_id"]
            isOneToOne: false
            referencedRelation: "zone_de_collecte"
            referencedColumns: ["id"]
          },
        ]
      }
      prevision: {
        Row: {
          capacite: number | null
          created_at: string
          date_avant_derniere_collecte: string | null
          date_dernier_formulaire_remplissage: string | null
          date_derniere_collecte: string | null
          date_estimation_prochaine_collecte: string | null
          id: number
          nb_bouteilles_avant_derniere_collecte: number | null
          nb_bouteilles_dernier_formulaire_remplissage: number | null
          nb_bouteilles_derniere_collecte: number | null
          nb_jours_avant_estimation_prochaine_collecte: number | null
          point_de_collecte_id: number
        }
        Insert: {
          capacite?: number | null
          created_at?: string
          date_avant_derniere_collecte?: string | null
          date_dernier_formulaire_remplissage?: string | null
          date_derniere_collecte?: string | null
          date_estimation_prochaine_collecte?: string | null
          id?: number
          nb_bouteilles_avant_derniere_collecte?: number | null
          nb_bouteilles_dernier_formulaire_remplissage?: number | null
          nb_bouteilles_derniere_collecte?: number | null
          nb_jours_avant_estimation_prochaine_collecte?: number | null
          point_de_collecte_id: number
        }
        Update: {
          capacite?: number | null
          created_at?: string
          date_avant_derniere_collecte?: string | null
          date_dernier_formulaire_remplissage?: string | null
          date_derniere_collecte?: string | null
          date_estimation_prochaine_collecte?: string | null
          id?: number
          nb_bouteilles_avant_derniere_collecte?: number | null
          nb_bouteilles_dernier_formulaire_remplissage?: number | null
          nb_bouteilles_derniere_collecte?: number | null
          nb_jours_avant_estimation_prochaine_collecte?: number | null
          point_de_collecte_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "prevision_point_de_collecte_id_fkey"
            columns: ["point_de_collecte_id"]
            isOneToOne: true
            referencedRelation: "point_de_collecte"
            referencedColumns: ["id"]
          },
        ]
      }
      remplissage_contenants: {
        Row: {
          date: string
          demande_collecte: boolean
          id: number
          nb_casiers_plein: number | null
          nb_casiers_total: number | null
          point_de_collecte_id: number
          remplissage_palox: number | null
        }
        Insert: {
          date?: string
          demande_collecte?: boolean
          id?: number
          nb_casiers_plein?: number | null
          nb_casiers_total?: number | null
          point_de_collecte_id: number
          remplissage_palox?: number | null
        }
        Update: {
          date?: string
          demande_collecte?: boolean
          id?: number
          nb_casiers_plein?: number | null
          nb_casiers_total?: number | null
          point_de_collecte_id?: number
          remplissage_palox?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "remplissage_casiers_point_de_collecte_id_fkey"
            columns: ["point_de_collecte_id"]
            isOneToOne: false
            referencedRelation: "point_de_collecte"
            referencedColumns: ["id"]
          },
        ]
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
          bon_de_tournee: string | null
          created_at: string
          date: string
          id: number
          point_de_massification_id: number
          prix: number | null
          statut: Database["public"]["Enums"]["statut_tournee"]
          transporteur_id: number
          type_de_vehicule:
            | Database["public"]["Enums"]["type_de_vehicule"]
            | null
          zone_de_collecte_id: number
        }
        Insert: {
          bon_de_tournee?: string | null
          created_at?: string
          date: string
          id?: number
          point_de_massification_id: number
          prix?: number | null
          statut?: Database["public"]["Enums"]["statut_tournee"]
          transporteur_id: number
          type_de_vehicule?:
            | Database["public"]["Enums"]["type_de_vehicule"]
            | null
          zone_de_collecte_id: number
        }
        Update: {
          bon_de_tournee?: string | null
          created_at?: string
          date?: string
          id?: number
          point_de_massification_id?: number
          prix?: number | null
          statut?: Database["public"]["Enums"]["statut_tournee"]
          transporteur_id?: number
          type_de_vehicule?:
            | Database["public"]["Enums"]["type_de_vehicule"]
            | null
          zone_de_collecte_id?: number
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
          {
            foreignKeyName: "tournee_zone_de_collecte_id_fkey"
            columns: ["zone_de_collecte_id"]
            isOneToOne: false
            referencedRelation: "zone_de_collecte"
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
      zone_de_collecte: {
        Row: {
          id: number
          nom: string
        }
        Insert: {
          id?: number
          nom: string
        }
        Update: {
          id?: number
          nom?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize_transporteur: {
        Args: {
          transporteur: number
        }
        Returns: boolean
      }
      authorize_user: {
        Args: {
          requested_permission: string
        }
        Returns: boolean
      }
      get_point_de_collecte_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_total_bouteilles_collecte: {
        Args: Record<PropertyKey, never>
        Returns: number
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
        | "zone_de_collecte.select"
        | "zone_de_collecte.update"
        | "zone_de_collecte.insert"
        | "zone_de_collecte.delete"
        | "prevision.select"
        | "mailing.select"
        | "mailing.insert"
        | "mailing.update"
        | "mailing.delete"
        | "mail_template.select"
      app_role: "staff" | "transporteur"
      contenant_collecte_type: "casier_x12" | "palox"
      palette_type: "Europe" | "VMF"
      point_de_collecte_statut: "archive" | "actif"
      point_de_collecte_type: "Magasin" | "Producteur" | "Massification"
      statut_mailing: "En attente" | "En cours" | "Envoyé" | "Échec"
      statut_tournee: "En attente de validation" | "Validé"
      type_de_vehicule: "12 T" | "19 T" | "VL" | "velo"
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

