import React from "react";
import { ProgressBar } from "./ProgressBar";

export default {
  title: "ProgressBar|ProgressBar",
  component: ProgressBar,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Step1 = () => <ProgressBar step={1} />;
export const Step2 = () => <ProgressBar step={2} />;
export const Step3 = () => <ProgressBar step={3} />;
