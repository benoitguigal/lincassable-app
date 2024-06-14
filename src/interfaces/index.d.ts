

export type PointDeCollecteTypeEnum = "Magsin" | "Producteur" | "Massification"

export interface IPointDeCollecte {
  type: PointDeCollecteTypeEnum;
  nom: string;
  adresse: string;
  longitude: number;
  latitude: number;
  horaires: string;
  emails: string[];
  telephones: string[]
}