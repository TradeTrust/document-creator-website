import { fireEvent, render, screen } from "@testing-library/react";
import { AddFormModal } from "./AddFormModal";

import { FormTemplate } from "../../../types";

describe("addFormModal", () => {
  it("should not display anything initially", () => {
    render(<AddFormModal onAdd={() => {}} show={false} onClose={() => {}} forms={[]} />);

    expect(screen.queryAllByText(/Choose Document Type to Issue/)).toHaveLength(0);
  });

  it("should display the modal when state changed to 'true'", () => {
    render(<AddFormModal onAdd={() => {}} show={true} onClose={() => {}} forms={[]} />);

    expect(screen.queryAllByText(/Choose Document Type to Issue/)).toHaveLength(1);
  });

  it("should fire 'onClose' function when clicked cancel button", () => {
    const mockOnClose = jest.fn();
    render(<AddFormModal onAdd={() => {}} show={true} onClose={mockOnClose} forms={[]} />);

    fireEvent.click(screen.getByTestId("cancel-add-form-button"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should fire 'onAdd' function when click form button", () => {
    const mockOnAdd = jest.fn();
    const mockForms = [
      {
        name: "Test Form 1",
        type: "VERIFIABLE_DOCUMENT",
        defaults: {},
        schema: {},
      },
    ] as FormTemplate[];
    render(<AddFormModal onAdd={mockOnAdd} show={true} onClose={() => {}} forms={mockForms} />);

    fireEvent.click(screen.getByTestId("add-form-button-0"));
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });
});
