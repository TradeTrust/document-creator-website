import React from "react";
import { Container } from "../../Container";
import { ConfigDropZone } from "./ConfigDropZone";

export default {
  title: "ConfigDropZone",
  component: ConfigDropZone,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const ConfigDropZoneStory = () => (
  <Container>
    <h1 className="storybook-title">Basic ConfigDropZone</h1>
    <ConfigDropZone onConfig={console.log} />
  </Container>
);
