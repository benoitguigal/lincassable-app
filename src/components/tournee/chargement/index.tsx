import { Collecte } from "../../../types";
import { chargementCollecte } from "../../../utility/weights";

export const Chargement: React.FC<{ collectes: Collecte[] }> = ({
  collectes,
}) => {
  const chargement = collectes.reduce((acc, collecte) => {
    return acc + chargementCollecte(collecte);
  }, 0);

  return (
    <div>
      {chargement}
      {" kg"}
    </div>
  );
};
