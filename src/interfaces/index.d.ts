

export type PointDeCollecteTypeEnum = "Magasin" | "Producteur" | "Massification"

export interface IPointDeCollecte {
  type: PointDeCollecteTypeEnum;
  nom: string;
  adresse: string;
  longitude: number;
  latitude: number;
  horaires: string;
  contacts: string[];
  emails: string[];
  telephones: string[]
}