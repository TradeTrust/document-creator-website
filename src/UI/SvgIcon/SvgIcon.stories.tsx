import React from "react";
import { SvgIcon, SvgIconArrowLeft, SvgIconPaperClip, SvgIconX } from "./SvgIcon";

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

export const IconX = () => (
  <SvgIcon>
    <SvgIconX />
  </SvgIcon>
);
