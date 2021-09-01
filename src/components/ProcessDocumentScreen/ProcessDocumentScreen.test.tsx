import { ProcessDocumentScreen } from "./ProcessDocumentScreen";
import sampleConfig from "../../test/fixtures/sample-config-ropsten.json";
import { getDefaultProvider, Wallet } from "ethers";
import { Config, FormEntry } from "../../types";
import sampleWrappedDocument from "../../test/fixtures/sample-wrapped-document.json";
import { useQueue } from "../../common/hook/useQueue";
import { QueueState, QueueType } from "../../constants/QueueState";
import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import FileSaver from "file-saver";

jest.mock("../../common/hook/useQueue");
jest.mock("file-saver", () => ({ saveAs: jest.fn() }));

const mockUseQueue = useQueue as jest.Mock;
const mockProcessDocuments = jest.fn();

const config = {
  ...sampleConfig,
  wallet: Wallet.createRandom().connect(getDefaultProvider("ropsten")),
} as Config;

const formEntries: FormEntry[] = [
  {
    fileName: "document",
    templateIndex: 0,
    data: {
      formData: { foo: "bar" },
    },
    ownership: { holderAddress: "", beneficiaryAddress: "" },
    extension: "tt",
  },
  {
    fileName: "document-2",
    templateIndex: 0,
    data: {
      formData: { foo: "bar" },
    },
    ownership: { holderAddress: "", beneficiaryAddress: "" },
    extension: "tt",
  },
];

const revokeDocumentEntries = [sampleWrappedDocument];

const whenQueueStateIsConfirmed = (): void => {
  mockUseQueue.mockReturnValue({
    processDocuments: mockProcessDocuments,
    queueState: QueueState.CONFIRMED,
    successfulProcessedDocuments: [
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
    failedProcessedDocuments: [],
    pendingProcessDocuments: [],
  });
};
const whenQueueStateIsConfirmButFailed = (): void => {
  mockUseQueue.mockReturnValue({
    processDocuments: mockProcessDocuments,
    queueState: QueueState.CONFIRMED,
    successfulProcessedDocuments: [],
    failedProcessedDocuments: [
      {
        documents: [
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
        error: new Error("Some Error"),
      },
    ],
    pendingProcessDocuments: [],
  });
};

const whenQueueStateIsError = (): void => {
  mockUseQueue.mockReturnValue({
    processDocuments: mockProcessDocuments,
    queueState: QueueState.ERROR,
    successfulProcessedDocuments: [],
    failedProcessedDocuments: [],
    pendingProcessDocuments: [],
  });
};

const whenQueueStateIsPending = (): void => {
  mockUseQueue.mockReturnValue({
    processDocuments: mockProcessDocuments,
    queueState: QueueState.PENDING,
    successfulProcessedDocuments: [],
    failedProcessedDocuments: [],
    pendingProcessDocuments: [],
  });
};

const whenQueueStateIsInitialize = (): void => {
  mockUseQueue.mockReturnValue({
    processDocuments: mockProcessDocuments,
    queueState: QueueState.INITIALIZED,
    successfulProcessedDocuments: [],
    failedProcessedDocuments: [],
    pendingProcessDocuments: [],
  });
};

describe("ProcessDocumentScreen", () => {
  it("should display the correct title while initialise with issue flow", () => {
    whenQueueStateIsInitialize();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={() => {}}
        forms={formEntries}
        type={QueueType.ISSUE}
      />
    );
    expect(screen.getByTestId("process-title")).toHaveTextContent("Please wait while we prepare your document(s)");
  });

  it("should display the correct title while initialise with revoke flow", () => {
    whenQueueStateIsInitialize();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={() => {}}
        fileName="document-1.tt"
        revokeDocuments={revokeDocumentEntries}
        type={QueueType.REVOKE}
      />
    );
    expect(screen.getByTestId("process-title")).toHaveTextContent("Please wait while we prepare your document");
  });

  it("should display the correct title while pending issuing", () => {
    whenQueueStateIsPending();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={() => {}}
        forms={formEntries}
        type={QueueType.ISSUE}
      />
    );
    expect(screen.getByTestId("process-title")).toHaveTextContent("Publishing document(s)...");
  });

  it("should display the correct title while pending revoke", () => {
    whenQueueStateIsPending();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={() => {}}
        fileName="document-1.tt"
        revokeDocuments={revokeDocumentEntries}
        type={QueueType.REVOKE}
      />
    );
    expect(screen.getByTestId("process-title")).toHaveTextContent("Revoking document...");
  });

  it("should display the correct title when document issue successfully", () => {
    whenQueueStateIsConfirmed();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={() => {}}
        forms={formEntries}
        type={QueueType.ISSUE}
      />
    );
    expect(screen.getByTestId("process-title")).toHaveTextContent("Document(s) issued successfully");
  });

  it("should display the correct title when document revoke successfully", () => {
    whenQueueStateIsConfirmed();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={() => {}}
        fileName="document-1.tt"
        revokeDocuments={revokeDocumentEntries}
        type={QueueType.REVOKE}
      />
    );
    expect(screen.getByTestId("process-title")).toHaveTextContent("Document revoked successfully");
  });

  it("should display the correct title when document has error", () => {
    whenQueueStateIsError();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={() => {}}
        forms={formEntries}
        type={QueueType.ISSUE}
      />
    );
    expect(screen.getByTestId("error-title")).toHaveTextContent("Failed to publish due to:");
  });

  it("should display the correct title when document has error", () => {
    whenQueueStateIsError();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={() => {}}
        fileName="document-1.tt"
        revokeDocuments={revokeDocumentEntries}
        type={QueueType.REVOKE}
      />
    );
    expect(screen.getByTestId("error-title")).toHaveTextContent("Failed to revoke due to:");
  });

  it("should display correctly when there are failed documents in issue flow", () => {
    whenQueueStateIsConfirmButFailed();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={() => {}}
        forms={formEntries}
        type={QueueType.ISSUE}
      />
    );
    expect(screen.getByTestId("process-title")).toHaveTextContent("Document(s) failed to issue");
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "These documents failed to publish due to some errors. Kindly rectify and try publishing again."
    );
  });

  it("should display correctly when there are failed documents in revoke flow", () => {
    whenQueueStateIsConfirmButFailed();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={() => {}}
        fileName="document-1.tt"
        revokeDocuments={revokeDocumentEntries}
        type={QueueType.REVOKE}
      />
    );
    expect(screen.getByTestId("process-title")).toHaveTextContent("Document failed to revoke");
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "These documents failed to publish due to some errors. Kindly rectify and try publishing again."
    );
  });

  it("should called download method for download a single file", async () => {
    whenQueueStateIsConfirmed();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={() => {}}
        forms={formEntries}
        type={QueueType.ISSUE}
      />
    );
    expect(screen.queryAllByTestId("download-file-button")).toHaveLength(1);

    await act(async () => {
      await fireEvent.click(screen.getByTestId("download-file-button"));
    });
    await waitFor(() => {
      expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);
    });
  });

  it("should called generateZipFile method for download all button", async () => {
    whenQueueStateIsConfirmed();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={() => {}}
        forms={formEntries}
        type={QueueType.ISSUE}
      />
    );
    expect(screen.queryAllByTestId("download-all-button")).toHaveLength(1);

    await act(async () => {
      await fireEvent.click(screen.getByTestId("download-all-button"));
    });
    await waitFor(() => {
      expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);
    });
  });

  it("should call processAnotherDocument function when clicked", async () => {
    whenQueueStateIsConfirmed();
    const processAnotherDocumentFn = jest.fn();
    render(
      <ProcessDocumentScreen
        config={config}
        processAnotherDocument={processAnotherDocumentFn}
        forms={formEntries}
        type={QueueType.ISSUE}
      />
    );

    expect(screen.getAllByTestId("process-another-document-button")).toHaveLength(1);

    await act(async () => {
      await fireEvent.click(screen.getByTestId("process-another-document-button"));
    });
    await waitFor(() => {
      expect(processAnotherDocumentFn).toHaveBeenCalledTimes(1);
    });
  });
});
