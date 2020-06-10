import { ProgressBar } from "./ProgressBar";
import React from "react";
import { render, screen } from "@testing-library/react";

describe("progressBar", () => {
  it("should display progress accordingly to the steps", () => {
    render(<ProgressBar step={2} />);
    expect(screen.getByTestId("progress-bar").innerHTML).toBe("Step 2/3: Fill Form");
  });
});
