import React, { useState, FunctionComponent } from "react";
import { ToggleSwitch } from "./ToggleSwitch";

export default {
  title: "UI/ToggleSwitch",
  component: ToggleSwitch,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default: FunctionComponent = () => {
  const [toggleValue, setToggleValue] = useState(false);
  return <ToggleSwitch isOn={toggleValue} handleToggle={() => setToggleValue(!toggleValue)} />;
};
