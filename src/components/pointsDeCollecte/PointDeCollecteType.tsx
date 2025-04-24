import { Tag } from "antd";
import React from "react";
import { PointDeCollecteTypeEnum } from "../../types";

type PointDeCollecteTypeProps = {
  value: PointDeCollecteTypeEnum;
};

const PointDeCollecteType: React.FC<PointDeCollecteTypeProps> = ({ value }) => {
  let color;
  let style = {};

  switch (value) {
    case "Magasin":
      color = "#253d39";
      break;
    case "Producteur":
      color = "#FDEA18";
      style = { color: "black" };
      break;
    case "Massification":
      color = "#EAEDEC";
      style = { color: "black" };
      break;
    case "Tri":
      color = "black";
      style = { color: "white" };
  }

  return (
    <Tag color={color} style={style}>
      {value}
    </Tag>
  );
};

export default PointDeCollecteType;
