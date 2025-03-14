import { Database } from "./supabase.ts";

export type Collecte = Database["public"]["Tables"]["collecte"]["Row"];
export type PointDeCollecte =
  Database["public"]["Tables"]["point_de_collecte"]["Row"];
export type Mailing = Database["public"]["Tables"]["mailing"]["Row"];
export type MailInsert = Database["public"]["Tables"]["mail"]["Insert"];
export type Tournee = Database["public"]["Tables"]["tournee"]["Row"];
export type RemplissageContenants =
  Database["public"]["Tables"]["remplissage_contenants"]["Row"];

export type InsertPayload<T> = {
  type: "INSERT";
  table: string;
  schema: string;
  record: T;
  old_record: null;
};

export type UpdatePayload<T> = {
  type: "UPDATE";
  table: string;
  schema: string;
  record: T;
  old_record: T;
};

export type DeletePayload<T> = {
  type: "DELETE";
  table: string;
  schema: string;
  record: null;
  old_record: T;
};
