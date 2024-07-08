export type PointDeCollecteTypeEnum =
  | "Magasin"
  | "Producteur"
  | "Massification";

export interface IPointDeCollecte {
  id: number;
  type: PointDeCollecteTypeEnum;
  nom: string;
  adresse: string;
  longitude: number;
  latitude: number;
  horaires: string;
  contacts: string[];
  emails: string[];
  telephones: string[];
}

export interface ITournee {
  id: number;
  date: Date;
  transporteur: "MAIN FORTE";
  point_de_massification_id: number;
  statut: "EN ATTENTE DE VALIDATION" | "VALIDE";
  zone: string;
}
export interface ICollecte {
  id: number;
  point_de_collecte_id: number;
  tournee_id: number;
  livraison_nb_casier_75_vide: number;
  livraison_nb_palox_vide: number;
  collecte_nb_casier_75_plein: number;
  collecte_nb_palox_plein: number;
}

export interface ICollecteItem {
  id: number;
  collecte_id: number;
  type: "collecte" | "livraison";
  contenant_type: "casier" | "palox";
  remplissage: "plein" | "vide";
  nombre: number;
}

export type UserRole = "staff" | "transporter";

export type UserPermission =
  | "point_de_collecte.list"
  | "point_de_collecte.show"
  | "point_de_collecte.create"
  | "point_de_collecte.edit"
  | "point_de_collecte.delete"
  | "tournee.list"
  | "tournee.show"
  | "tournee.create"
  | "tournee.edit"
  | "tournee.delete";
