import React from "react";
import { Container } from "../Container";
import { ErrorAlert } from "./Alert";

export default {
  title: "|Alert|ErrorAlert",
  component: ErrorAlert,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const TitleAndMessage = () => (
  <Container>
    <ErrorAlert title="Error" message="Cow has gone home" />
  </Container>
);

export const MessageOnly = () => (
  <Container>
    <ErrorAlert message="Cow has gone home" />
  </Container>
);
