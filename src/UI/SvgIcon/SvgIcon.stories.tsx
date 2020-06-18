import React from "react";
import { SvgIcon, SvgIconArrowLeft, SvgIconPaperClip } from "./SvgIcon";

export default {
  title: "SvgIcons|SvgIcon",
  component: SvgIcon,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const ArrowLeft = () => (
  <SvgIcon>
    <SvgIconArrowLeft />
  </SvgIcon>
);

export const PaperClip = () => (
  <SvgIcon>
    <SvgIconPaperClip />
  </SvgIcon>
);
