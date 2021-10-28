import { FunctionComponent } from "react";
import { MemoryRouter } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";

export default {
  title: "Error/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    componentSubtitle: "ErrorBoundary.",
  },
};

const ErrorComponent: FunctionComponent = () => {
  throw new Error(
    "Error!! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  );
};
export const Default: FunctionComponent = () => (
  <MemoryRouter>
    <ErrorBoundary>
      <ErrorComponent />
    </ErrorBoundary>
  </MemoryRouter>
);
