import React, { FunctionComponent } from "react";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

const ErrorComponent: FunctionComponent = () => {
  throw new Error("Intentionally throws error");
};

describe("errorboundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.spyOn(console, "error").mockRestore();
  });

  it("should calls getLogger and renders that there was a problem", () => {
    expect.assertions(1);
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("error-boundary-content")).toBeInTheDocument();
  });
});
