import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { useFormsContext } from "../../common/context/forms";
import { useQueue } from "../../common/hook/useQueue";
import { QueueState } from "./../../constants/QueueState";
import { PublishContainer } from "./PublishContainer";

import sampleConfig from "../../test/fixtures/config/v3/sample-config-local.json";

jest.mock("../../common/context/forms");
jest.mock("../../common/context/config");
jest.mock("../../common/hook/useQueue");

const mockUseFormsContext = useFormsContext as jest.Mock;
const mockUseConfigContext = useConfigContext as jest.Mock;
const mockUseQueue = useQueue as jest.Mock;
const mockSetActiveFormIndex = jest.fn();
const mockSetForms = jest.fn();
const mockProcessDocuments = jest.fn();

const whenNoConfig = (): void => {
  mockUseConfigContext.mockReturnValue({ config: undefined });
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
  mockUseQueue.mockReturnValue({
    processDocuments: mockProcessDocuments,
    queueState: QueueState.INITIALIZED,
    successfulProcessedDocuments: [],
    failedProcessedDocuments: [],
    pendingProcessDocuments: [],
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
