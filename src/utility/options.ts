import {
  ContenantDeCollecteTypeEnum,
  PointDeCollecteTypeEnum,
  StatutTourneeEnum,
  TypeDeVehiculeEnum,
} from "../types";

type PointDeCollecteTypeOption = {
  value: PointDeCollecteTypeEnum;
  label: string;
};

export const pointDeCollecteTypeOptions: PointDeCollecteTypeOption[] = [
  { value: "Magasin", label: "Magasin" },
  { value: "Producteur", label: "Producteur" },
  { value: "Massification", label: "Massification" },
];

type ContenantDeCollecteTypeOption = {
  value: ContenantDeCollecteTypeEnum;
  label: string;
};

export const contenantDeCollecteTypeOptions: ContenantDeCollecteTypeOption[] = [
  { value: "casier_x12", label: "Casier 12x75cl" },
  { value: "palox", label: "Palox" },
];

type StatutTourneeOption = {
  value: StatutTourneeEnum;
  label: string;
};

export const statutTourneeOptions: StatutTourneeOption[] = [
  { value: "En attente de validation", label: "En attente de validation" },
  { value: "Validé", label: "Validé" },
];

type TypeDeVehiculeOption = {
  value: TypeDeVehiculeEnum;
  label: string;
};

export const typeDeVehiculeOptions: TypeDeVehiculeOption[] = [
  { value: "velo", label: "Vélo" },
  { value: "VL", label: "VL" },
  { value: "12 T", label: "12 T" },
  { value: "19 T", label: "19 T" },
];
