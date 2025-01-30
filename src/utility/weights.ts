import Decimal from "decimal.js";
import { Collecte } from "../types";

export const POID_BOUTEILLE = 0.54;

export const POID_BOUTEILLE_33 = 0.28;

export const POID_CASIER_PLEIN_KG =
  // 12 bouteilles de 540g
  12 * POID_BOUTEILLE +
  // poids du casier
  2.27;

export const POID_CASIER_33_PLEIN_KG =
  // 24 bouteilles de 250g
  24 * POID_BOUTEILLE_33 +
  // poids du casier
  2.27;

export const POID_PALOX_PLEIN_KG =
  // 550 bouteilles de 540g
  550 * POID_BOUTEILLE +
  // poid du palox vide
  72;

export const POID_PALETTE_BOUTEILLE_KG = 1200 * POID_BOUTEILLE;

export function chargementCollecte(
  collecte: Pick<
    Collecte,
    | "collecte_nb_casier_75_plein"
    | "collecte_nb_casier_33_plein"
    | "collecte_nb_palox_plein"
    | "collecte_nb_palette_bouteille"
  >
) {
  const {
    collecte_nb_casier_75_plein,
    collecte_nb_casier_33_plein,
    collecte_nb_palox_plein,
    collecte_nb_palette_bouteille,
  } = collecte;
  const chargement = new Decimal(0)
    .add(collecte_nb_casier_75_plein * POID_CASIER_PLEIN_KG)
    .add(collecte_nb_casier_33_plein * POID_CASIER_33_PLEIN_KG)
    .add(collecte_nb_palox_plein * POID_PALOX_PLEIN_KG)
    .add(collecte_nb_palette_bouteille * POID_PALETTE_BOUTEILLE_KG);
  return chargement.toDecimalPlaces(0).toNumber();
}
