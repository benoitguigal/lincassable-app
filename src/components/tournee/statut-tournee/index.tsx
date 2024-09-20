import { Tag } from "antd";
import { StatutTourneeEnum } from "../../../types";

type StatutTourneeTag = {
  value: StatutTourneeEnum;
};

export const StatutTourneeTag: React.FC<StatutTourneeTag> = ({ value }) => {
  const color = value === "En attente de validation" ? "orange" : "green";
  return <Tag color={color}>{value}</Tag>;
};
