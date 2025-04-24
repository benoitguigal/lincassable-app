import {
  ContenantDeCollecteTypeEnum,
  PointDeCollecteTypeEnum,
  StatutPaloxEnum,
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
  { value: "Tri", label: "Centre de tri" },
];

type ContenantDeCollecteTypeOption = {
  value: ContenantDeCollecteTypeEnum;
  label: string;
};

export const contenantDeCollecteTypeOptions: ContenantDeCollecteTypeOption[] = [
  { value: "casier_x12", label: "Casier 12x75cl" },
  { value: "casier_x24", label: "Casier 24x33cl" },
  { value: "palox", label: "Palox" },
];

type StatutTourneeOption = {
  value: StatutTourneeEnum;
  label: string;
  disabled?: boolean;
};

export const statutTourneeOptions: StatutTourneeOption[] = [
  { value: "En cours de préparation", label: "En cours de préparation" },
  {
    value: "En attente de validation",
    label: "En attente de validation",
  },
  { value: "Validé", label: "Validé" },
  { value: "Réalisé", label: "Réalisé" },
  { value: "Clôturé", label: "Clôturé" },
];

export const statutTourneeOptionsTransporteur = statutTourneeOptions.map(
  (o) => {
    // le transporteur n'a pas accès à tous les statuts
    const forbiddenStatuses = ["En cours de préparation", "Clôturé"];
    if (forbiddenStatuses.includes(o.value)) {
      return { ...o, disabled: true };
    }
    return o;
  }
);

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

type StatutPaloxOption = {
  value: StatutPaloxEnum;
  label: string;
};

export const statutPaloxOptions: StatutPaloxOption[] = [
  { value: "En stock", label: "En stock" },
  { value: "Tri", label: "Tri" },
  { value: "Point de collecte", label: "Collecte" },
  { value: "Lavage", label: "Lavage" },
];
