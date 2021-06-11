import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { useFormsContext } from "../../../common/context/forms";
import { DocumentSelector } from "./DocumentSelector";

jest.mock("../../../common/context/forms");

const mockUseFormsContext = useFormsContext as jest.Mock;
const mockSetActiveFormIndex = jest.fn();
const mockSetForms = jest.fn();
const mockCurrentFileName = jest.fn();
const mockClosePreviewMode = jest.fn();

const whenActiveFormsAreAvailable = (): void => {
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 0,
    setForms: mockSetForms,
    setCurrentFileName: mockCurrentFileName,
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

const whenActiveFormsIndexIs1 = (): void => {
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
      fileName: "document-2",
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

describe("documentSelector", () => {
  beforeEach(() => {
    mockSetActiveFormIndex.mockReset();
    mockSetForms.mockReset();
    mockClosePreviewMode.mockReset();
  });

  it("should display the document selector correctly", () => {
    whenActiveFormsAreAvailable();
    const mockValidateCurrentForm = jest.fn();
    render(<DocumentSelector validateCurrentForm={mockValidateCurrentForm} closePreviewMode={mockClosePreviewMode} />);

    expect(screen.queryAllByTestId("previous-document-button")).toHaveLength(1);
    expect(screen.queryAllByTestId("file-name-input")).toHaveLength(1);
    expect(screen.queryAllByTestId("next-document-button")).toHaveLength(1);
  });

  it("should fire the function when the next arrow button is clicked", async () => {
    whenActiveFormsAreAvailable();
    const mockValidateCurrentForm = jest.fn().mockReturnValue(true);
    render(<DocumentSelector validateCurrentForm={mockValidateCurrentForm} closePreviewMode={mockClosePreviewMode} />);

    fireEvent.click(screen.getByTestId("next-document-button"));
    expect(mockValidateCurrentForm).toHaveBeenCalledTimes(1);
    expect(mockClosePreviewMode).toHaveBeenCalledTimes(1);
  });

  it("should fire the function when the previous arrow button is clicked", () => {
    whenActiveFormsIndexIs1();
    const mockValidateCurrentForm = jest.fn().mockReturnValue(true);
    render(<DocumentSelector validateCurrentForm={mockValidateCurrentForm} closePreviewMode={mockClosePreviewMode} />);

    fireEvent.click(screen.getByTestId("previous-document-button"));
    expect(mockValidateCurrentForm).toHaveBeenCalledTimes(1);
    expect(mockClosePreviewMode).toHaveBeenCalledTimes(1);
  });

  it("should display the file name input field correctly", () => {
    whenActiveFormsAreAvailable();
    const mockValidateCurrentForm = jest.fn();
    render(<DocumentSelector validateCurrentForm={mockValidateCurrentForm} closePreviewMode={mockClosePreviewMode} />);
    expect(screen.getByTestId("file-name-input")).toHaveValue("document-1");
  });

  it("should set the file name when there is a change in the file name", () => {
    whenActiveFormsAreAvailable();
    const mockValidateCurrentForm = jest.fn();
    render(<DocumentSelector validateCurrentForm={mockValidateCurrentForm} closePreviewMode={mockClosePreviewMode} />);
    fireEvent.change(screen.getByLabelText("file-name-input"), { target: { value: "CCO-1" } });
    expect(mockCurrentFileName).toHaveBeenCalledTimes(1);
  });
});
