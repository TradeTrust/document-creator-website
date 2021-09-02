import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { useFormsContext } from "../../../common/context/forms";
import { DynamicFormHeader } from "./DynamicFormHeader";

jest.mock("../../../common/context/forms");

const mockUseFormsContext = useFormsContext as jest.Mock;
const mockSetActiveFormIndex = jest.fn();
const mockSetForms = jest.fn();
const mockClosePreviewMode = jest.fn();

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
    mockClosePreviewMode.mockReset();
  });

  it("should display the header UI correctly", () => {
    whenActiveFormsAreAvailable();
    render(
      <MemoryRouter>
        <DynamicFormHeader
          onBackToFormSelection={() => {}}
          onFormSubmit={() => {}}
          onNewForm={() => {}}
          validateCurrentForm={() => false}
          closePreviewMode={mockClosePreviewMode}
        />
      </MemoryRouter>
    );

    expect(screen.queryAllByText("Clear All")).toHaveLength(1);
    expect(screen.queryAllByText("Fill and Preview Form")).toHaveLength(1);
    expect(screen.queryAllByText("Add New")).toHaveLength(1);
    expect(screen.queryAllByText("Create Document")).toHaveLength(1);
  });

  it("should fire the 'add new' function when add new button is clicked", () => {
    whenActiveFormsAreAvailable();
    const mockOnNewForm = jest.fn();
    render(
      <MemoryRouter>
        <DynamicFormHeader
          onBackToFormSelection={() => {}}
          onFormSubmit={() => {}}
          onNewForm={mockOnNewForm}
          validateCurrentForm={() => false}
          closePreviewMode={mockClosePreviewMode}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("add-new-button"));
    expect(mockOnNewForm).toHaveBeenCalledTimes(1);
  });

  it("should fire the 'back' function when back button is clicked", () => {
    whenActiveFormsAreAvailable();
    const mockOnBackToFormSelection = jest.fn();
    render(
      <MemoryRouter>
        <DynamicFormHeader
          onBackToFormSelection={mockOnBackToFormSelection}
          onFormSubmit={() => {}}
          onNewForm={() => {}}
          validateCurrentForm={() => false}
          closePreviewMode={mockClosePreviewMode}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("clear-all-button"));
    expect(mockOnBackToFormSelection).toHaveBeenCalledTimes(1);
  });

  it("should fire the 'submit' function when submit button is clicked", () => {
    whenActiveFormsAreAvailable();
    const mockonFormSubmit = jest.fn();
    render(
      <MemoryRouter>
        <DynamicFormHeader
          onBackToFormSelection={() => {}}
          onFormSubmit={mockonFormSubmit}
          onNewForm={() => {}}
          validateCurrentForm={() => false}
          closePreviewMode={mockClosePreviewMode}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("form-submit-button"));
    expect(mockonFormSubmit).toHaveBeenCalledTimes(1);
  });

  it("should display number of documents correctly", () => {
    whenActiveFormsAreAvailable();
    const mockValidateCurrentForm = jest.fn().mockReturnValue(true);
    render(
      <MemoryRouter>
        <DynamicFormHeader
          onBackToFormSelection={() => {}}
          onFormSubmit={() => {}}
          onNewForm={() => {}}
          validateCurrentForm={mockValidateCurrentForm}
          closePreviewMode={mockClosePreviewMode}
        />
      </MemoryRouter>
    );

    expect(screen.queryAllByText("2 of 2 document(s)")).toHaveLength(1);
  });

  it("should fire validation when switching documents", () => {
    whenActiveFormsAreAvailable();
    const mockValidateCurrentForm = jest.fn().mockReturnValue(true);
    render(
      <MemoryRouter>
        <DynamicFormHeader
          onBackToFormSelection={() => {}}
          onFormSubmit={() => {}}
          onNewForm={() => {}}
          validateCurrentForm={mockValidateCurrentForm}
          closePreviewMode={mockClosePreviewMode}
        />
      </MemoryRouter>
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
      <MemoryRouter>
        <DynamicFormHeader
          onBackToFormSelection={() => {}}
          onFormSubmit={() => {}}
          onNewForm={() => {}}
          validateCurrentForm={mockValidateCurrentForm}
          closePreviewMode={mockClosePreviewMode}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("previous-document-button"));
    expect(mockSetActiveFormIndex).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("next-document-button"));
    expect(mockSetActiveFormIndex).toHaveBeenCalledTimes(1);
  });

  it("should close preview mode when switching documents", () => {
    whenActiveFormsAreAvailable();
    const mockValidateCurrentForm = jest.fn().mockReturnValue(true);
    render(
      <MemoryRouter>
        <DynamicFormHeader
          onBackToFormSelection={() => {}}
          onFormSubmit={() => {}}
          onNewForm={() => {}}
          validateCurrentForm={mockValidateCurrentForm}
          closePreviewMode={mockClosePreviewMode}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("previous-document-button"));
    expect(mockClosePreviewMode).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("next-document-button"));
    expect(mockClosePreviewMode).toHaveBeenCalledTimes(1);
  });
});
