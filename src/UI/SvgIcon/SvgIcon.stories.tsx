import React from "react";
import { SvgIcon, SvgIconArrowLeft } from "./SvgIcon";

export default {
  title: "SvgIconArrowLeft|SvgIconArrowLeft",
  component: SvgIconArrowLeft,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => (
  <SvgIcon>
    <SvgIconArrowLeft />
  </SvgIcon>
);
