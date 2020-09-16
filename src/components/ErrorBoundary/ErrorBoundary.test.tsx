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
    expect.assertions(2);
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("error-boundary-content")).toBeInTheDocument();

    // by mocking out console.error we may inadvertantly be missing out on logs
    // in the future that could be important, so let's reduce that liklihood by
    // adding an assertion for how frequently console.error is called.
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});
