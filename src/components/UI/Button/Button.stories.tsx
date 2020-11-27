import React, { FunctionComponent } from "react";
import { Button } from "./Button";

export default {
  title: "UI/Button",
  component: Button,
  parameters: {
    componentSubtitle: "Button.",
  },
};

export const Default: FunctionComponent = () => (
  <Button onClick={() => alert("clicked! You clicked the button!")}>
    okay! This is the button!
  </Button>
);
