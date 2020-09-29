import { render, screen } from "@testing-library/react";
import React from "react";
import { ProgressBar } from "./ProgressBar";

describe("progressBar", () => {
  it("should display progress correctly when step is 1", () => {
    render(<ProgressBar step={1} />);
    expect(screen.getByTestId("progress-bar").innerHTML).toBe("Step 1/3: Choose Type");
  });

  it("should display progress correctly when step is 2", () => {
    render(<ProgressBar step={2} />);
    expect(screen.getByTestId("progress-bar").innerHTML).toBe("Step 2/3: Fill Form");
  });

  it("should display progress correctly when step is 3", () => {
    render(<ProgressBar step={3} />);
    expect(screen.getByTestId("progress-bar").innerHTML).toBe("Step 3/3: Issue Document(s)");
  });
});
