import React from "react";
import { ProgressBar } from "./ProgressBar";

export default {
  title: "ProgressBar|ProgressBar",
  component: ProgressBar,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => <ProgressBar step={1} />;
