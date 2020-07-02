import { fireEvent, render, screen } from "@testing-library/react";
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

const whenActiveFormIsAvailable = (): void => {
  mockUseConfigContext.mockReturnValue({ config: sampleConfig });
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 0,
    setForms: mockSetForms,
    setActiveFormIndex: mockSetActiveFormIndex,
    forms: [
      {
        fileName: "document-1.tt",
        data: { formData: {} },
        templateIndex: 0,
      },
    ],
    currentForm: {
      fileName: "document-1.tt",
      data: { formData: {} },
      templateIndex: 0,
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

    expect(screen.getByLabelText("Consignment Information")).not.toBeUndefined();
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

  it("should remove dialog when cancel is clicked", () => {
    whenActiveFormIsAvailable();
    render(
      <MemoryRouter>
        <DynamicFormLayout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("delete-button"));
    fireEvent.click(screen.getByTestId("cancel-form-button"));

    expect(screen.queryAllByText("Delete Form")).toHaveLength(0);
  });
});
