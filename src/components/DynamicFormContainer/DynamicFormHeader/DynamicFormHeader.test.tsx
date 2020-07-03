import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { DynamicFormHeader } from "./DynamicFormHeader";

describe("dynamicFormHeader", () => {
  it("should display the header UI correctly", () => {
    render(
      <DynamicFormHeader
        onBackToFormSelection={() => {}}
        onFormSubmit={() => {}}
        onNewForm={() => {}}
      />
    );

    expect(screen.queryAllByText("Back")).toHaveLength(1);
    expect(screen.queryAllByText("Fill and Preview Form")).toHaveLength(1);
    expect(screen.queryAllByText("Add New")).toHaveLength(1);
    expect(screen.queryAllByText("Issue Document")).toHaveLength(1);
  });

  it("should fire the 'add new' function when add new button is clicked", () => {
    const mockOnNewForm = jest.fn();
    render(
      <DynamicFormHeader
        onBackToFormSelection={() => {}}
        onFormSubmit={() => {}}
        onNewForm={mockOnNewForm}
      />
    );

    fireEvent.click(screen.getByTestId("add-new-button"));
    expect(mockOnNewForm).toHaveBeenCalledTimes(1);
  });

  it("should fire the 'back' function when back button is clicked", () => {
    const mockOnBackToFormSelection = jest.fn();
    render(
      <DynamicFormHeader
        onBackToFormSelection={mockOnBackToFormSelection}
        onFormSubmit={() => {}}
        onNewForm={() => {}}
      />
    );

    fireEvent.click(screen.getByTestId("back-button"));
    expect(mockOnBackToFormSelection).toHaveBeenCalledTimes(1);
  });

  it("should fire the 'submit' function when submit button is clicked", () => {
    const mockonFormSubmit = jest.fn();
    render(
      <DynamicFormHeader
        onBackToFormSelection={() => {}}
        onFormSubmit={mockonFormSubmit}
        onNewForm={() => {}}
      />
    );

    fireEvent.click(screen.getByTestId("form-submit-button"));
    expect(mockonFormSubmit).toHaveBeenCalledTimes(1);
  });
});
