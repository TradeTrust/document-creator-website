import { FunctionComponent } from "react";
import { ErrorBoundaryContent } from "./ErrorBoundaryContent";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "Error/ErrorBoundaryContent",
  component: ErrorBoundaryContent,
  parameters: {
    componentSubtitle: "ErrorBoundaryContent.",
  },
};

export const Default: FunctionComponent = () => (
  <MemoryRouter>
    <ErrorBoundaryContent
      error={
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Morbi tristique senectus et netus."
      }
    />{" "}
  </MemoryRouter>
);
