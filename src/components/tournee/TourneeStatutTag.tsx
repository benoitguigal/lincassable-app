import { Tag } from "antd";
import { StatutTourneeEnum } from "../../types";

type StatutTourneeTag = {
  value: StatutTourneeEnum;
};

const TourneeStatutTag: React.FC<StatutTourneeTag> = ({ value }) => {
  let color = "";

  switch (value) {
    case "En cours de préparation":
      color = "navy";
      break;
    case "En attente de validation":
      color = "sandybrown";
      break;
    case "Validé":
      color = "seagreen";
      break;
    case "Réalisé":
      color = "olive";
      break;
    case "Clôturé":
      color = "brown";
      break;
  }

  return <Tag color={color}>{value}</Tag>;
};

export default TourneeStatutTag;
