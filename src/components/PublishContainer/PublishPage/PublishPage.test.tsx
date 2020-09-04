import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";
import { useConfigContext } from "../../../common/context/config";
import { useFormsContext } from "../../../common/context/forms";
import { usePublishQueue } from "../../../common/hook/usePublishQueue";
import sampleConfig from "../../../test/fixtures/sample-config.json";
import { PublishContainer } from "../PublishContainer";

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
    publishState: "CONFIRMED",
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
      },
    ],
    failedPublishedDocuments: [],
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
    publishState: "ERROR",
    publishedDocuments: [],
    failedPublishedDocuments: [],
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
    publishState: "PENDING_CONFIRMATION",
    publishedDocuments: [],
    failedPublishedDocuments: [],
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

  it("should display the publishing screen when publishing document", () => {
    whenPublishStateIsPending();
    render(
      <MemoryRouter>
        <PublishContainer />
      </MemoryRouter>
    );

    expect(
      screen.queryAllByText(/Please wait while we are publishing the document(s)./)
    ).toHaveLength(0);
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
