import React, { FunctionComponent } from "react";
import { Container } from "../Container";
import { ErrorAlert } from "./Alert";

export default {
  title: "Error/ErrorAlert",
  component: ErrorAlert,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const TitleAndMessage: FunctionComponent = () => (
  <Container>
    <ErrorAlert title="Error" message="Cow has gone home" />
  </Container>
);

export const MessageOnly: FunctionComponent = () => (
  <Container>
    <ErrorAlert message="Cow has gone home" />
  </Container>
);
