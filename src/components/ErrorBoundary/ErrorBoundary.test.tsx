import React, { FunctionComponent } from "react";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";
import { MemoryRouter } from "react-router-dom";

const ErrorComponent: FunctionComponent = () => {
  throw new Error("Intentionally throws error");
};

describe("errorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.spyOn(console, "error").mockRestore();
  });

  it("should calls getLogger and renders that there was a problem", () => {
    expect.assertions(2);
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getAllByText("ERROR")).toHaveLength(1);
    expect(screen.getAllByText("Something Went Wrong")).toHaveLength(1);
  });
});
