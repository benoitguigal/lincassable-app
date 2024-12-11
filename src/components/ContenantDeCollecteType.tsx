import { Tag } from "antd";
import React from "react";
import { ContenantDeCollecteTypeEnum } from "../types";

type ContenantDeCollecteTypeProps = {
  value: ContenantDeCollecteTypeEnum;
};

const ContenantDeCollecteType: React.FC<ContenantDeCollecteTypeProps> = ({
  value,
}) => {
  let label = "";

  switch (value) {
    case "casier_x12":
      label = "Casier 12x75cl";
      break;
    case "palox":
      label = "Palox";
      break;
  }

  return <Tag>{label}</Tag>;
};

export default ContenantDeCollecteType;
