import React, { useState } from "react";
import { ToggleSwitch } from "./ToggleSwitch";

export default {
  title: "ToggleSwitch|ToggleSwitch",
  component: ToggleSwitch,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => {
  const [toggleValue, setToggleValue] = useState(false);
  return <ToggleSwitch isOn={toggleValue} handleToggle={() => setToggleValue(!toggleValue)} />;
};
