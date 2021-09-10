import React, { FunctionComponent } from "react";
import { ProgressBar } from "./ProgressBar";

export default {
  title: "Progress/ProgressBar",
  component: ProgressBar,
  parameters: {
    componentSubtitle: "ProgressBar.",
  },
};

export const Step1: FunctionComponent = () => <ProgressBar step={1} totalSteps={3} />;
export const Step2: FunctionComponent = () => <ProgressBar step={2} totalSteps={3} />;
export const Step3: FunctionComponent = () => <ProgressBar step={3} totalSteps={3} />;
