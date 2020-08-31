import { render, screen } from "@testing-library/react";
import React from "react";
import { PublishErrorScreen } from "./PublishErrorScreen";

const error = new Error("some Error");

describe("publishErrorScreen", () => {
  it("should display the page correctly", () => {
    render(<PublishErrorScreen error={error} />);

    expect(screen.getAllByText("Document(s) failed to issue")).toHaveLength(1);
    expect(screen.getAllByText("Failed to publish due to:")).toHaveLength(1);
    expect(screen.getAllByText("- some Error")).toHaveLength(1);
  });
});
