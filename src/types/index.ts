import { Database } from "./supabase";

export type PointDeCollecteTypeEnum =
  Database["public"]["Enums"]["point_de_collecte_type"];

export type ContenantDeCollecteTypeEnum =
  Database["public"]["Enums"]["contenant_collecte_type"];

export type UserRole = Database["public"]["Enums"]["app_role"];

export type StatutTourneeEnum = Database["public"]["Enums"]["statut_tournee"];

export type TypeDeVehiculeEnum =
  Database["public"]["Enums"]["type_de_vehicule"];

export type StatutPaloxEnum = Database["public"]["Enums"]["statut_palox"];

export type PointDeCollecte =
  Database["public"]["Tables"]["point_de_collecte"]["Row"];

export type RemplissageContenants =
  Database["public"]["Tables"]["remplissage_contenants"]["Row"];

export type Tournee = Database["public"]["Tables"]["tournee"]["Row"];

export type Collecte = Database["public"]["Tables"]["collecte"]["Row"];

export type Transporteur = Database["public"]["Tables"]["transporteur"]["Row"];

export type TransporteurUser =
  Database["public"]["Tables"]["transporteur_users"]["Row"];

export type ZoneDeCollecte =
  Database["public"]["Tables"]["zone_de_collecte"]["Row"];

export type Consigne = Database["public"]["Tables"]["consigne"]["Row"];

export type Prevision = Database["public"]["Tables"]["prevision"]["Row"];

export type Mailing = Database["public"]["Tables"]["mailing"]["Row"];

export type MailTemplate = Database["public"]["Tables"]["mail_template"]["Row"];

export type Mail = Database["public"]["Tables"]["mail"]["Row"];

export type Inventaire = Database["public"]["Tables"]["inventaire"]["Row"];

export type Palox = Database["public"]["Tables"]["palox"]["Row"];

export type Identity = {
  id: string;
  email: string;
  appRole: UserRole;
  transporteurId: number;
};
export type CollecteWithPointDeCollecte = Collecte & {
  point_de_collecte?: PointDeCollecte | null;
};
