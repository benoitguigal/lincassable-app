import { PointDeCollecte } from "../types";

const VITE_HOST = import.meta.env.VITE_HOST;

export function getPointDeCollecteFormulaireUrl(
  pointDeCollecte: PointDeCollecte
) {
  return (
    `${VITE_HOST}/point-de-collecte/taux-de-remplissage/${pointDeCollecte.id}?` +
    `nom=${pointDeCollecte.nom}&contenant_collecte=${pointDeCollecte.contenant_collecte_type}`
  );
}
