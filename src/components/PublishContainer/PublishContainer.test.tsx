import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { useFormsContext } from "../../common/context/forms";
import { usePublishQueue } from "../../common/hook/usePublishQueue";
import sampleConfig from "../../test/fixtures/sample-config.json";
import { PublishContainer } from "./PublishContainer";

jest.mock("../../common/context/forms");
jest.mock("../../common/context/config");
jest.mock("../../common/hook/usePublishQueue");

const mockUseFormsContext = useFormsContext as jest.Mock;
const mockUseConfigContext = useConfigContext as jest.Mock;
const mockUsePublishQueue = usePublishQueue as jest.Mock;
const mockSetActiveFormIndex = jest.fn();
const mockSetForms = jest.fn();
const mockPublish = jest.fn();

const whenNoConfig = (): void => {
  mockUseConfigContext.mockReturnValue({ config: undefined });
};

const whenPublishStateIsNotConfirmed = (): void => {
  mockUseConfigContext.mockReturnValue({ config: sampleConfig });
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 0,
    setForms: mockSetForms,
    setActiveFormIndex: mockSetActiveFormIndex,
    forms: [
      {
        fileName: "document-1",
        data: { formData: {} },
        templateIndex: 0,
      },
    ],
    currentForm: {
      fileName: "document-1",
      data: { formData: {} },
      templateIndex: 0,
    },
  });
  mockUsePublishQueue.mockReturnValue({
    publish: mockPublish,
    publishState: "INITIALIZED",
    publishedDocuments: [],
    failedPublishedDocuments: [],
    pendingPublishDocuments: [],
  });
};

describe("publishContainer", () => {
  it("should redirect to '/' if no config file", () => {
    whenNoConfig();
    render(
      <MemoryRouter>
        <PublishContainer />
      </MemoryRouter>
    );

    expect(screen.queryAllByText(/Please wait while we prepare your document/)).toHaveLength(0);
  });

  it("should display preparing screen when documents are being sorted into jobs", () => {
    whenPublishStateIsNotConfirmed();
    render(
      <MemoryRouter>
        <PublishContainer />
      </MemoryRouter>
    );

    expect(screen.queryAllByText(/Please wait while we prepare your document/)).toHaveLength(1);
  });
});
