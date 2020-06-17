import { DynamicFormLayout } from "./DynamicFormLayout";
import React from "react";
import { MemoryRouter } from "react-router";
import { fireEvent, render, screen } from "@testing-library/react";
import { useFormsContext } from "../../common/context/forms";
import { useConfigContext } from "../../common/context/config";
import sampleConfig from "../../test/fixtures/sample-config.json";

jest.mock("../../common/context/forms");
jest.mock("../../common/context/config");

const mockUseFormsContext = useFormsContext as jest.Mock;
const mockUseConfigContext = useConfigContext as jest.Mock;
const mockSetActiveFormIndex = jest.fn();

const whenActiveFormIsAvailable = (): void => {
  mockUseConfigContext.mockReturnValue({ config: sampleConfig });
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 0,
    setActiveFormIndex: mockSetActiveFormIndex,
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

describe.skip("dynamicFormLayout", () => {
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

    expect(screen.getByLabelText("BL Number*")).not.toBeUndefined();
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
});
