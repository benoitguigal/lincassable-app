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
}

export interface ICollecteItem {
  id: number;
  collecte_id: number;
  type: "collecte" | "livraison";
  contenant_type: "casier" | "palox";
  remplissage: "plein" | "vide";
  nombre: number;
}
