import { PointDeCollecte } from "../types";

const VITE_HOST = import.meta.env.VITE_HOST;

export function getPointDeCollecteFormulaireRemplissageUrl(
  pointDeCollecte: PointDeCollecte
) {
  return (
    `${VITE_HOST}/point-de-collecte/taux-de-remplissage/${pointDeCollecte.id}?` +
    `nom=${encodeURIComponent(pointDeCollecte.nom)}&contenant_collecte=${
      pointDeCollecte.contenant_collecte_type
    }`
  );
}

export function getPointDeCollecteConsigneFormulaireUrl(
  pointDeCollecte: PointDeCollecte,
  start: string,
  end: string
) {
  return (
    `${VITE_HOST}/point-de-collecte/consigne/${pointDeCollecte.id}?` +
    `nom=${pointDeCollecte.nom}&start=${start}&end=${end}`
  );
}
