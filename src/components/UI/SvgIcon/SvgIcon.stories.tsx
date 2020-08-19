import React from "react";
import {
  SvgIcon,
  SvgIconArrowLeft,
  SvgIconCheckCircle,
  SvgIconDownload,
  SvgIconPaperClip,
  SvgIconTrash,
  SvgIconX,
  SvgIconXCircle,
} from "./SvgIcon";

export default {
  title: "SvgIcons/SvgIcon",
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

export const CheckCircle = () => (
  <SvgIcon>
    <SvgIconCheckCircle />
  </SvgIcon>
);

export const Trash = () => (
  <SvgIcon>
    <SvgIconTrash />
  </SvgIcon>
);

export const XCircle = () => (
  <SvgIcon>
    <SvgIconXCircle />
  </SvgIcon>
);

export const Download = () => (
  <SvgIcon>
    <SvgIconDownload />
  </SvgIcon>
);
