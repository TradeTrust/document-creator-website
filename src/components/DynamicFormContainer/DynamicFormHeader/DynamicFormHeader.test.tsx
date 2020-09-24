import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { useFormsContext } from "../../../common/context/forms";
import { DynamicFormHeader } from "./DynamicFormHeader";

jest.mock("../../../common/context/forms");

const mockUseFormsContext = useFormsContext as jest.Mock;
const mockSetActiveFormIndex = jest.fn();
const mockSetForms = jest.fn();

const whenActiveFormsAreAvailable = (): void => {
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 1,
    setForms: mockSetForms,
    setActiveFormIndex: mockSetActiveFormIndex,
    forms: [
      {
        fileName: "document-1",
        data: { formData: {} },
        templateIndex: 0,
        ownership: { holderAddress: "", beneficiaryAddress: "" },
      },
      {
        fileName: "document-2",
        data: { formData: {} },
        templateIndex: 0,
        ownership: { holderAddress: "", beneficiaryAddress: "" },
      },
    ],
    currentForm: {
      fileName: "document-1",
      data: { formData: {} },
      templateIndex: 0,
      ownership: { holderAddress: "", beneficiaryAddress: "" },
    },
    currentFormTemplate: {
      name: "COO",
      type: "VERIFIABLE_DOCUMENT",
      defaults: {},
      schema: {
        type: "object",
        properties: {
          foo: { type: "string", title: "Foo Field" },
          bar: { type: "string" },
        },
      },
    },
  });
};

describe("dynamicFormHeader", () => {
  beforeEach(() => {
    mockSetActiveFormIndex.mockReset();
    mockSetForms.mockReset();
  });

  it("should display the header UI correctly", () => {
    whenActiveFormsAreAvailable();
    render(
      <DynamicFormHeader
        onBackToFormSelection={() => {}}
        onFormSubmit={() => {}}
        onNewForm={() => {}}
        validateCurrentForm={() => false}
      />
    );

    expect(screen.queryAllByText("Back")).toHaveLength(1);
    expect(screen.queryAllByText("Fill and Preview Form")).toHaveLength(1);
    expect(screen.queryAllByText("Add New")).toHaveLength(1);
    expect(screen.queryAllByText("Issue Document")).toHaveLength(1);
  });

  it("should fire the 'add new' function when add new button is clicked", () => {
    whenActiveFormsAreAvailable();
    const mockOnNewForm = jest.fn();
    render(
      <DynamicFormHeader
        onBackToFormSelection={() => {}}
        onFormSubmit={() => {}}
        onNewForm={mockOnNewForm}
        validateCurrentForm={() => false}
      />
    );

    fireEvent.click(screen.getByTestId("add-new-button"));
    expect(mockOnNewForm).toHaveBeenCalledTimes(1);
  });

  it("should fire the 'add new' function when control + n is pressed", () => {
    whenActiveFormsAreAvailable();
    const mockOnNewForm = jest.fn();
    render(
      <DynamicFormHeader
        onBackToFormSelection={() => {}}
        onFormSubmit={() => {}}
        onNewForm={mockOnNewForm}
        validateCurrentForm={() => false}
      />
    );
    const formHeaderDom = screen.getByTestId("dynamic-form-header");
    fireEvent.keyDown(formHeaderDom, { key: "Control" });
    fireEvent.keyDown(formHeaderDom, { key: "Meta" });
    fireEvent.keyDown(formHeaderDom, { key: "n" });
    expect(mockOnNewForm).toHaveBeenCalledTimes(1);
  });

  it("should fire the 'back' function when back button is clicked", () => {
    whenActiveFormsAreAvailable();
    const mockOnBackToFormSelection = jest.fn();
    render(
      <DynamicFormHeader
        onBackToFormSelection={mockOnBackToFormSelection}
        onFormSubmit={() => {}}
        onNewForm={() => {}}
        validateCurrentForm={() => false}
      />
    );

    fireEvent.click(screen.getByTestId("back-button"));
    expect(mockOnBackToFormSelection).toHaveBeenCalledTimes(1);
  });

  it("should fire the 'submit' function when submit button is clicked", () => {
    whenActiveFormsAreAvailable();
    const mockonFormSubmit = jest.fn();
    render(
      <DynamicFormHeader
        onBackToFormSelection={() => {}}
        onFormSubmit={mockonFormSubmit}
        onNewForm={() => {}}
        validateCurrentForm={() => false}
      />
    );

    fireEvent.click(screen.getByTestId("form-submit-button"));
    expect(mockonFormSubmit).toHaveBeenCalledTimes(1);
  });

  it("should fire the 'submit' function when control + i is pressed", () => {
    whenActiveFormsAreAvailable();
    const mockonFormSubmit = jest.fn();
    render(
      <DynamicFormHeader
        onBackToFormSelection={() => {}}
        onFormSubmit={mockonFormSubmit}
        onNewForm={() => {}}
        validateCurrentForm={() => false}
      />
    );

    const formHeaderDom = screen.getByTestId("dynamic-form-header");
    fireEvent.keyDown(formHeaderDom, { key: "Control" });
    fireEvent.keyDown(formHeaderDom, { key: "Meta" });
    fireEvent.keyDown(formHeaderDom, { key: "i" });
    expect(mockonFormSubmit).toHaveBeenCalledTimes(1);
  });

  it("should display number of documents correctly", () => {
    whenActiveFormsAreAvailable();
    const mockValidateCurrentForm = jest.fn().mockReturnValue(true);
    render(
      <DynamicFormHeader
        onBackToFormSelection={() => {}}
        onFormSubmit={() => {}}
        onNewForm={() => {}}
        validateCurrentForm={mockValidateCurrentForm}
      />
    );

    expect(screen.queryAllByText("2 of 2 document(s)")).toHaveLength(1);
  });

  it("should fire validation when switching documents", () => {
    whenActiveFormsAreAvailable();
    const mockValidateCurrentForm = jest.fn().mockReturnValue(true);
    render(
      <DynamicFormHeader
        onBackToFormSelection={() => {}}
        onFormSubmit={() => {}}
        onNewForm={() => {}}
        validateCurrentForm={mockValidateCurrentForm}
      />
    );

    fireEvent.click(screen.getByTestId("previous-document-button"));
    expect(mockValidateCurrentForm).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("next-document-button"));
    expect(mockValidateCurrentForm).toHaveBeenCalledTimes(1);
  });

  it("should switch active form index when previous button is clicked", () => {
    whenActiveFormsAreAvailable();
    const mockValidateCurrentForm = jest.fn().mockReturnValue(true);
    render(
      <DynamicFormHeader
        onBackToFormSelection={() => {}}
        onFormSubmit={() => {}}
        onNewForm={() => {}}
        validateCurrentForm={mockValidateCurrentForm}
      />
    );

    fireEvent.click(screen.getByTestId("previous-document-button"));
    expect(mockSetActiveFormIndex).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("next-document-button"));
    expect(mockSetActiveFormIndex).toHaveBeenCalledTimes(1);
  });
});
