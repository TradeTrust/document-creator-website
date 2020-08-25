import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BackModal } from "./BackModal";

describe("backModal", () => {
  it("shouldnot display anythingg on initial", () => {
    render(<BackModal backToFormSelection={() => {}} show={false} closeBackModal={() => {}} />);

    expect(screen.queryAllByText(/Back to form selection/)).toHaveLength(0);
  });

  it("should display the modal when state changed to 'true'", () => {
    render(<BackModal backToFormSelection={() => {}} show={true} closeBackModal={() => {}} />);

    expect(screen.queryAllByText(/Back to form selection/)).toHaveLength(1);
  });

  it("should fire 'backToFormSelection' function when clicked back button", () => {
    const mockBackToFormSelection = jest.fn();
    render(
      <BackModal
        backToFormSelection={mockBackToFormSelection}
        show={true}
        closeBackModal={() => {}}
      />
    );

    fireEvent.click(screen.getByTestId("red-back-button"));
    expect(mockBackToFormSelection).toHaveBeenCalledTimes(1);
  });

  it("should fire 'closeBackModal' function when clicked cancel button", () => {
    const mockCloseBackModal = jest.fn();
    render(
      <BackModal backToFormSelection={() => {}} show={true} closeBackModal={mockCloseBackModal} />
    );

    fireEvent.click(screen.getByTestId("cancel-form-button"));
    expect(mockCloseBackModal).toHaveBeenCalledTimes(1);
  });
});
