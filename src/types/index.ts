import { Database } from "./supabase";

export type PointDeCollecteTypeEnum =
  Database["public"]["Enums"]["point_de_collecte_type"];

export type UserRole = Database["public"]["Enums"]["app_role"];

export type PointDeCollecte =
  Database["public"]["Tables"]["point_de_collecte"]["Row"];

export type Tournee = Database["public"]["Tables"]["tournee"]["Row"];

export type Collecte = Database["public"]["Tables"]["collecte"]["Row"];

export type Transporteur = Database["public"]["Tables"]["transporteur"]["Row"];

export type TransporteurUser =
  Database["public"]["Tables"]["transporteur_users"]["Row"];

export type Identity = { id: string; email: string; appRole: UserRole };
export type CollecteWithPointDeCollecte = Collecte & {
  point_de_collecte?: PointDeCollecte | null;
};
