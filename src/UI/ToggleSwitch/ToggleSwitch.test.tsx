import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ToggleSwitch } from "./ToggleSwitch";

describe("toggleSwitch", () => {
  it("should fire handleToggle when clicked", () => {
    const mockHandleToggle = jest.fn();

    render(<ToggleSwitch isOn={true} handleToggle={mockHandleToggle} />);
    fireEvent.click(screen.getByTestId("toggle-switch"));
    expect(mockHandleToggle).toHaveBeenCalled();
  });
  xit("should display `ON` when isOn is true", () => {});
  xit("should display `OFF` when isOn is false", () => {});
});
