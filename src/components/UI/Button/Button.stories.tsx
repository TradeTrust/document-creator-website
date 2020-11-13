import React, { FunctionComponent } from "react";
import { Button } from "./Button";

export default {
  title: "Button|Button",
  component: Button,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default: FunctionComponent = () => (
  <Button onClick={() => alert("clicked! You clicked the button!")}>
    okay! This is the button!
  </Button>
);
