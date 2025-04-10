import { Tag } from "antd";
import React from "react";
import { StatutPaloxEnum } from "../../types";

type StatutPaloxProps = {
  value: StatutPaloxEnum;
};

const StatutPalox: React.FC<StatutPaloxProps> = ({ value }) => {
  let color;
  let style = {};

  switch (value) {
    case "En stock":
      color = "green";
      break;
    case "Tri":
      color = "purple";
      break;
    case "Point de collecte":
      color = "gold";
      break;
    case "Lavage":
      color = "blue";
      break;
    default:
      color = "default";
      style = {};
      break;
  }

  return (
    <Tag color={color} style={style}>
      {value}
    </Tag>
  );
};

export default StatutPalox;
