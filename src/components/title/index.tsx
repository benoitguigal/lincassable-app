import { RefineLayoutThemedTitleProps, ThemedTitleV2 } from "@refinedev/antd";
import React from "react";
import { PluieIconSvg } from "../icons";

export const LincassableTitle: React.FC<RefineLayoutThemedTitleProps> = (
  props
) => {
  return (
    <ThemedTitleV2 {...props} icon={PluieIconSvg({})} text="L'INCASSABLE" />
  );
};
