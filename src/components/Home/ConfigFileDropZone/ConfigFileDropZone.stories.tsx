import React from "react";
import { Container } from "../../Container";
import { ConfigFileDropZone } from "./ConfigFileDropZone";
export default {
  title: "Home|ConfigFileDropZone",
  component: ConfigFileDropZone,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => (
  <Container>
    <ConfigFileDropZone onConfigFile={(configFile) => console.log(JSON.stringify(configFile, null, 2))} />
  </Container>
);
