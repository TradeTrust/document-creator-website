import React from "react";
import { ToggleSwitch } from "./ToggleSwitch";

export default {
  title: "ToggleSwitch|ToggleSwitch",
  component: ToggleSwitch,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => <ToggleSwitch isOn={true} />;
