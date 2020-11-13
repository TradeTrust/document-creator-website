import React, { FunctionComponent } from "react";
import { Container } from "../../Container";
import { ConfigFileDropZone } from "./ConfigFileDropZone";
export default {
  title: "Home|ConfigFileDropZone",
  component: ConfigFileDropZone,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default: FunctionComponent = () => (
  <Container>
    <ConfigFileDropZone
      onConfigFile={(configFile) => console.log(JSON.stringify(configFile, null, 2))}
    />
  </Container>
);

export const WithError: FunctionComponent = () => (
  <Container>
    <ConfigFileDropZone
      errorMessage="Config file is malformed"
      onConfigFile={(configFile) => console.log(JSON.stringify(configFile, null, 2))}
    />
  </Container>
);
