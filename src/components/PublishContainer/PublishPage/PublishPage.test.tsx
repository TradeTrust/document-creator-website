import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";
import { useConfigContext } from "../../../common/context/config";
import { useFormsContext } from "../../../common/context/forms";
import { usePublishQueue } from "../../../common/hook/usePublishQueue";
import sampleConfig from "../../../test/fixtures/sample-config-ropsten.json";
import { PublishContainer } from "../PublishContainer";
import { PublishState } from "./../../../constants/PublishState";

jest.mock("../../../common/context/forms");
jest.mock("../../../common/context/config");
jest.mock("../../../common/hook/usePublishQueue");

const mockUseFormsContext = useFormsContext as jest.Mock;
const mockUseConfigContext = useConfigContext as jest.Mock;
const mockUsePublishQueue = usePublishQueue as jest.Mock;
const mockSetActiveFormIndex = jest.fn();
const mockSetForms = jest.fn();
const mockPublish = jest.fn();

const whenPublishStateIsConfirmed = (): void => {
  mockUseConfigContext.mockReturnValue({ config: sampleConfig });
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 0,
    setForms: mockSetForms,
    setActiveFormIndex: mockSetActiveFormIndex,
    forms: [
      {
        fileName: "document-1",
        extension: "tt",
        data: { formData: {} },
        templateIndex: 0,
      },
    ],
    currentForm: {
      fileName: "document-1",
      extension: "tt",
      data: { formData: {} },
      templateIndex: 0,
    },
  });
  mockUsePublishQueue.mockReturnValue({
    publish: mockPublish,
    publishState: PublishState.CONFIRMED,
    publishedDocuments: [
      {
        contractAddress: "",
        fileName: "Document-1",
        payload: {},
        type: "VERIFIABLE_DOCUMENT",
        rawDocument: {},
        wrappedDocument: {
          data: {},
          signature: {},
          version: "",
        },
        extension: "tt",
      },
    ],
    failedPublishedDocuments: [],
    pendingPublishDocuments: [],
  });
};

const whenPublishStateIsError = (): void => {
  mockUseConfigContext.mockReturnValue({ config: sampleConfig });
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 0,
    setForms: mockSetForms,
    setActiveFormIndex: mockSetActiveFormIndex,
    forms: [
      {
        fileName: "document-1",
        extension: "tt",
        data: { formData: {} },
        templateIndex: 0,
      },
    ],
    currentForm: {
      fileName: "document-1",
      extension: "tt",
      data: { formData: {} },
      templateIndex: 0,
    },
  });
  mockUsePublishQueue.mockReturnValue({
    publish: mockPublish,
    publishState: PublishState.ERROR,
    publishedDocuments: [],
    failedPublishedDocuments: [],
    pendingPublishDocuments: [],
  });
};

const whenNoConfig = (): void => {
  mockUseConfigContext.mockReturnValue({ config: undefined });
};

const whenPublishStateIsPending = (): void => {
  mockUseConfigContext.mockReturnValue({ config: sampleConfig });
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 0,
    setForms: mockSetForms,
    setActiveFormIndex: mockSetActiveFormIndex,
    forms: [
      {
        fileName: "document-1",
        extension: "tt",
        data: { formData: {} },
        templateIndex: 0,
      },
    ],
    currentForm: {
      fileName: "document-1",
      extension: "tt",
      data: { formData: {} },
      templateIndex: 0,
    },
  });
  mockUsePublishQueue.mockReturnValue({
    publish: mockPublish,
    publishState: PublishState.INITIALIZED,
    publishedDocuments: [],
    failedPublishedDocuments: [],
    pendingPublishDocuments: [],
  });
};

describe("publishContainer", () => {
  it("should redirect to '/' when there is no config", () => {
    whenNoConfig();
    render(
      <MemoryRouter>
        <PublishContainer />
      </MemoryRouter>
    );

    expect(screen.queryAllByText(/Document(s) issued successfully/)).toHaveLength(0);
  });

  it("should display the preparing screen when sorting documents into jobs", () => {
    whenPublishStateIsPending();
    render(
      <MemoryRouter>
        <PublishContainer />
      </MemoryRouter>
    );

    expect(screen.queryAllByText(/Please wait while we prepare your document/)).toHaveLength(1);
  });

  it("should display the published screen when documents are published", () => {
    whenPublishStateIsConfirmed();
    render(
      <MemoryRouter>
        <PublishContainer />
      </MemoryRouter>
    );

    expect(screen.queryAllByText("Document(s) issued successfully")).toHaveLength(1);
    expect(screen.queryAllByText("Document-1-ropsten.tt")).toHaveLength(1);
  });

  it("should display the publish error screen when there is an error", () => {
    whenPublishStateIsError();
    render(
      <MemoryRouter>
        <PublishContainer />
      </MemoryRouter>
    );

    expect(screen.queryAllByText(/Failed to publish due to:/)).toHaveLength(1);
  });
});
