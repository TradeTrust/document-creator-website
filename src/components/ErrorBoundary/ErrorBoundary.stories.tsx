import React, { FunctionComponent } from "react";
import { ErrorBoundaryContent } from "./ErrorBoundaryContent";

export default {
  title: "Error/ErrorBoundaryContent",
  component: ErrorBoundaryContent,
  parameters: {
    componentSubtitle: "ErrorBoundaryContent.",
  },
};

export const Default: FunctionComponent = () => (
  <ErrorBoundaryContent
    error={
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Morbi tristique senectus et netus. Odio morbi quis commodo odioaenean. Mauris sit amet massa vitae tortor condimentum lacinia quis vel. Ac odio tempor orcidapibus ultrices in iaculis. In hac habitasse platea dictumst vestibulum."
    }
  />
);
