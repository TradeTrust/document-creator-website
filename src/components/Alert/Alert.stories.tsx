import React, { FunctionComponent } from "react";
import { ErrorAlert } from "./Alert";

export default {
  title: "Error/ErrorAlert",
  component: ErrorAlert,
  parameters: {
    componentSubtitle: "ErrorAlert.",
  },
};

export const TitleAndMessage: FunctionComponent = () => (
  <ErrorAlert title="Error" message="Cow has gone home" />
);

export const MessageOnly: FunctionComponent = () => <ErrorAlert message="Cow has gone home" />;
