import { ICollecte } from "../../../interfaces";

export const Chargement: React.FC<{ collectes: ICollecte[] }> = ({
  collectes,
}) => {
  const casierCollecte = collectes.reduce(
    (nb, collecte) => nb + collecte.collecte_nb_casier_75_plein,
    0
  );

  const casierLivraison = collectes.reduce(
    (nb, collecte) => nb + collecte.livraison_nb_casier_75_vide,
    0
  );

  const paloxCollecte = collectes.reduce(
    (nb, collecte) => nb + collecte.collecte_nb_palox_plein,
    0
  );

  const paloxLivraison = collectes.reduce(
    (nb, collecte) => nb + collecte.livraison_nb_palox_vide,
    0
  );

  return (
    <div>
      {casierLivraison > 0 && (
        <div>Casiers 75 vides à livrer: {casierLivraison}</div>
      )}
      {casierCollecte > 0 && (
        <div>Casiers 75 plein à collecter: {casierCollecte}</div>
      )}
      {paloxLivraison > 0 && <div>Paloxs vides à livrer: {paloxLivraison}</div>}
      {paloxCollecte > 0 && (
        <div>Paloxs pleins à collecter: {paloxCollecte}</div>
      )}
    </div>
  );
};
