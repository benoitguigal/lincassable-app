import { Tag } from "antd";
import React from "react";

type PointDeCollecteTypeProps = {
  value: "Magasin" | "Producteur";
};

export const PointDeCollecteType: React.FC<PointDeCollecteTypeProps> = ({
  value,
}) => {
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
  }

  return (
    <Tag color={color} style={style}>
      {value}
    </Tag>
  );
};
