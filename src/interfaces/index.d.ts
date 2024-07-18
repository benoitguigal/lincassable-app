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
  transporteur_id: number;
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

export interface ITransporteur {
  id: number;
  nom: string;
}

export interface ICollecteItem {
  id: number;
  collecte_id: number;
  type: "collecte" | "livraison";
  contenant_type: "casier" | "palox";
  remplissage: "plein" | "vide";
  nombre: number;
}

export type UserRole = "staff" | "transporteur";

export type IIdentity = { id: string; email: string; appRole: UserRole };

export type ITransporteurUser = { transporteur_id: number; userId: string };
