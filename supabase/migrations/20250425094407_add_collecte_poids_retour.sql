alter table
  "public"."collecte"
add
  column "chargement_retour" real;

update
  "public"."collecte"
set
  "chargement_retour" = ((0.54 * 12) + 2.27) * "collecte_nb_casier_75_plein" + ((24 * 0.28) + 2.27) * "collecte_nb_casier_33_plein" + ((550 * 0.54) + 72) * "collecte_nb_palox_plein" + 1200 * 0.54 * "collecte_nb_palette_bouteille";