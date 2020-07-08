import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { useFormsContext } from "../../common/context/forms";
import sampleConfig from "../../test/fixtures/sample-config.json";
import { DynamicFormLayout } from "./DynamicFormLayout";

jest.mock("../../common/context/forms");
jest.mock("../../common/context/config");

const mockUseFormsContext = useFormsContext as jest.Mock;
const mockUseConfigContext = useConfigContext as jest.Mock;
const mockSetActiveFormIndex = jest.fn();
const mockSetForms = jest.fn();
const mockSetCurrentFormData = jest.fn();

const whenActiveFormIsAvailable = (): void => {
  mockUseConfigContext.mockReturnValue({
    config: {
      ...sampleConfig,
      forms: [
        {
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
      ],
    },
  });
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 0,
    setForms: mockSetForms,
    setActiveFormIndex: mockSetActiveFormIndex,
    setCurrentFormData: mockSetCurrentFormData,
    forms: [
      {
        fileName: "document-1.tt",
        data: { formData: {} },
        templateIndex: 0,
        ownership: { holderAddress: "", beneficiaryAddress: "" },
      },
    ],
    currentForm: {
      fileName: "document-1.tt",
      data: { formData: {} },
      templateIndex: 0,
      ownership: { holderAddress: "", beneficiaryAddress: "" },
    },
  });
};

const whenIsTransferableRecord = (): void => {
  mockUseConfigContext.mockReturnValue({
    config: {
      ...sampleConfig,
      forms: [
        {
          name: "Bill of Lading",
          type: "TRANSFERABLE_RECORD",
          defaults: {},
          schema: {
            type: "object",
            properties: {
              foo: { type: "string", title: "Foo Field" },
              bar: { type: "string" },
            },
          },
        },
      ],
    },
  });
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 0,
    setForms: mockSetForms,
    setActiveFormIndex: mockSetActiveFormIndex,
    setCurrentFormData: mockSetCurrentFormData,
    forms: [
      {
        fileName: "document-1.tt",
        data: { formData: {} },
        templateIndex: 0,
        ownership: { holderAddress: "", beneficiaryAddress: "" },
      },
    ],
    currentForm: {
      fileName: "document-1.tt",
      data: { formData: {} },
      templateIndex: 0,
      ownership: { holderAddress: "", beneficiaryAddress: "" },
    },
  });
};

const whenActiveFormIndexIsNotAvailable = (): void => {
  mockUseConfigContext.mockReturnValue({ config: sampleConfig });
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: undefined,
    setActiveFormIndex: mockSetActiveFormIndex,
  });
};
const whenActiveFormConfigIsNotAvailable = (): void => {
  mockUseConfigContext.mockReturnValue({});
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: undefined,
    setActiveFormIndex: mockSetActiveFormIndex,
  });
};

const mockData = (files: File[]): any => {
  return {
    dataTransfer: {
      files,
      items: files.map((file: any) => ({
        kind: "file",
        type: file.type,
        getAsFile: () => file,
      })),
      types: ["Files"],
    },
  };
};

describe("dynamicFormLayout", () => {
  beforeEach(() => {
    mockSetActiveFormIndex.mockReset();
    mockSetForms.mockReset();
  });

  it("should render the progress bar", () => {
    whenActiveFormIsAvailable();
    render(
      <MemoryRouter>
        <DynamicFormLayout />
      </MemoryRouter>
    );
    expect(screen.getByTestId("progress-bar")).not.toBeNull();
  });
  it("should render the back button", () => {
    whenActiveFormIsAvailable();
    render(
      <MemoryRouter>
        <DynamicFormLayout />
      </MemoryRouter>
    );
    expect(screen.getByTestId("back-button")).not.toBeNull();
  });
  it("should unset activeFormIndex on clicking back", () => {
    whenActiveFormIsAvailable();
    render(
      <MemoryRouter>
        <DynamicFormLayout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("back-button"));
    expect(mockSetActiveFormIndex).toHaveBeenCalled(); // eslint-disable-line jest/prefer-called-with
    expect(mockSetForms).toHaveBeenCalledWith([]);
  });
  it("should render toggle switch for preview mode", () => {
    whenActiveFormIsAvailable();
    render(
      <MemoryRouter>
        <DynamicFormLayout />
      </MemoryRouter>
    );
    expect(screen.getByTestId("toggle-switch")).not.toBeNull();
  });
  it("should render the active form", () => {
    whenActiveFormIsAvailable();
    render(
      <MemoryRouter>
        <DynamicFormLayout />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Foo Field")).not.toBeUndefined();
  });
  it("should redirect when activeFormIndex === 'undefined'", () => {
    whenActiveFormIndexIsNotAvailable();
    render(
      <MemoryRouter>
        <DynamicFormLayout />
      </MemoryRouter>
    );
    expect(screen.queryAllByText("Fill and Preview Form")).toHaveLength(0);
  });
  it("should redirect when !activeForm", () => {
    whenActiveFormConfigIsNotAvailable();
    render(
      <MemoryRouter>
        <DynamicFormLayout />
      </MemoryRouter>
    );
    expect(screen.queryAllByText("Fill and Preview Form")).toHaveLength(0);
  });

  it("should display the modal when delete button is clicked", () => {
    whenActiveFormIsAvailable();
    render(
      <MemoryRouter>
        <DynamicFormLayout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("delete-button"));

    expect(screen.getByTestId("modal-dialog")).not.toBeNull();
  });

  it("should merge the data with defaults and file drop and fire handleSubmit when form is submitted", async () => {
    whenActiveFormIsAvailable();
    render(
      <MemoryRouter>
        <DynamicFormLayout />
      </MemoryRouter>
    );

    // Drop data file in drop zone
    const dropzone = screen.getByTestId("data-upload-zone");
    const file = new File(
      [
        JSON.stringify({
          cow: "moo",
        }),
      ],
      "sample.json",
      {
        type: "application/json",
      }
    );
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      await fireEvent(dropzone, event);
    });
    await waitFor(() =>
      expect(mockSetCurrentFormData).toHaveBeenCalledWith({
        formData: {
          cow: "moo",
        },
      })
    );
  });

  it("should show the TransferableRecordForm when a form is a transferable record", () => {
    whenIsTransferableRecord();
    render(
      <MemoryRouter>
        <DynamicFormLayout />
      </MemoryRouter>
    );

    expect(screen.queryAllByText("Beneficiary")).toHaveLength(1);
    expect(screen.queryAllByText("Holder")).toHaveLength(1);
  });
});
