import { ICollecteItem } from "../../../interfaces";

export const Chargement: React.FC<{ items: ICollecteItem[] }> = ({ items }) => {
  const casierCollecte = items.find(
    (i) => i.contenant_type === "casier" && i.type === "collecte"
  );

  const casierLivraison = items.find(
    (i) => i.contenant_type === "casier" && i.type === "livraison"
  );

  const paloxCollecte = items.find(
    (i) => i.contenant_type === "palox" && i.type === "collecte"
  );

  const paloxLivraison = items.find(
    (i) => i.contenant_type === "palox" && i.type === "livraison"
  );

  return (
    <div>
      {casierLivraison && (
        <div>
          Casiers à livrer: {casierLivraison.nombre}{" "}
          {casierLivraison.remplissage}
        </div>
      )}
      {casierCollecte && (
        <div>
          Casiers à collecter: {casierCollecte.nombre}{" "}
          {casierCollecte.remplissage}
        </div>
      )}
      {paloxLivraison && (
        <div>
          Paloxs à livrer: {paloxLivraison.nombre} {paloxLivraison.remplissage}
        </div>
      )}
      {paloxCollecte && (
        <div>
          Paloxs à collecter: {paloxCollecte.nombre} {paloxCollecte.remplissage}
        </div>
      )}
    </div>
  );
};
