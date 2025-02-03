import { PointDeCollecte } from "../../types";
import { getPointDeCollecteFormulaireRemplissageUrl } from "../../utility/urls";

// Génère un ensemble de variables par point de collecte qui peuvent
// être utilisé pour le rendu des emails
export default function renderVariables(pointDeCollecte: PointDeCollecte) {
  return {
    lienFormulaireRemplissage:
      getPointDeCollecteFormulaireRemplissageUrl(pointDeCollecte),
  };
}
