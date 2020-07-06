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
  mockUsePublishQueue.mockReturnValue({
    publish: mockPublish,
    publishState: "INITIALIZED",
    wrappedDocuments: [
      {
        contractAddress: "",
        fileName: "Document-1.tt",
        payload: {},
        type: "VERIFIABLE_DOCUMENT",
        rawDocument: {},
        wrappedDocument: {
          data: {},
          signature: {},
          version: "",
        },
      },
    ],
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

    expect(screen.queryAllByText(/Please wait while we are publishing/)).toHaveLength(0);
  });

  it("should display publishing screen when documents are being publish", () => {
    whenPublishStateIsNotConfirmed();
    render(
      <MemoryRouter>
        <PublishContainer />
      </MemoryRouter>
    );

    expect(screen.queryAllByText(/Please wait while we are publishing/)).toHaveLength(1);
    expect(screen.queryAllByText(/Publishing/)).toHaveLength(1);
  });
});
