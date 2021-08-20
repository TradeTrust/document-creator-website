import { act, renderHook } from "@testing-library/react-hooks";
import { getDefaultProvider, Wallet } from "ethers";
import { QueueState, QueueType } from "../../../constants/QueueState";
import { publishJob } from "../../../services/publishing";
import { revokeDocumentJob } from "../../../services/revoking";
import sampleConfig from "../../../test/fixtures/sample-config-ropsten.json";
import samplePublishJobs from "../../../test/fixtures/sample-jobs.json";
import sampleRevokeJobs from "../../../test/fixtures/sample-revoke-jobs.json";
import { Config, FormEntry } from "../../../types";
import { uploadToStorage } from "../../API/storageAPI";
import { useQueue } from "./useQueue";
import { getPublishingJobs } from "./utils/publish";
import { getRevokingJobs } from "./utils/revoke";
import sampleWrappedDocument from "../../../test/fixtures/sample-wrapped-document.json";

jest.mock("../../../services/publishing");
jest.mock("./utils/publish");
jest.mock("../../API/storageAPI");
jest.mock("../../../services/revoking");
jest.mock("./utils/revoke");

const mockPublishJob = publishJob as jest.Mock;
const mockGetPublishingJobs = getPublishingJobs as jest.Mock;
const mockUploadToStorage = uploadToStorage as jest.Mock;
const mockRevokeJob = revokeDocumentJob as jest.Mock;
const mockGetRevokeJobs = getRevokingJobs as jest.Mock;

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

const uploadSuccess = {
  success: true,
  errorMsg: "",
};

describe("useQueue", () => {
  it("should have the correct initial state", () => {
    const { result } = renderHook(() => useQueue({ config, formEntries }));
    expect(result.current.queueState).toBe(QueueState.UNINITIALIZED);
    expect(result.current.successfulProcessedDocuments).toStrictEqual([]);
  });

  it("should publish correctly", async () => {
    mockGetPublishingJobs.mockReturnValueOnce(samplePublishJobs);
    mockPublishJob.mockResolvedValue("tx-id");
    mockUploadToStorage.mockReturnValue(uploadSuccess);
    const { result } = renderHook(() => useQueue({ config, formEntries }));
    await act(async () => {
      await result.current.processDocuments(QueueType.ISSUE);
    });
    expect(result.current.queueState).toBe(QueueState.CONFIRMED);
    expect(result.current.successfulProcessedDocuments).toHaveLength(3);
  });

  it("should file failed jobs to failPublishedDocuments for publish flow", async () => {
    mockGetPublishingJobs.mockReturnValueOnce(samplePublishJobs);
    mockPublishJob.mockResolvedValue("tx-id");
    mockPublishJob.mockRejectedValueOnce(new Error("Some error"));
    mockUploadToStorage.mockReturnValue(uploadSuccess);
    const { result } = renderHook(() => useQueue({ config, formEntries }));
    await act(async () => {
      await result.current.processDocuments(QueueType.ISSUE);
    });
    expect(result.current.failedProcessedDocuments).toHaveLength(1);
  });

  it("should publish correctly if uploaded document is working", async () => {
    mockGetPublishingJobs.mockReturnValueOnce(samplePublishJobs);
    mockPublishJob.mockResolvedValue("tx-id");
    mockUploadToStorage.mockReturnValue(uploadSuccess);

    const { result } = renderHook(() => useQueue({ config, formEntries }));
    await act(async () => {
      await result.current.processDocuments(QueueType.ISSUE);
    });

    expect(result.current.successfulProcessedDocuments).toHaveLength(3);
  });

  it("should have error if getPublishJobs throw error", async () => {
    mockGetPublishingJobs.mockRejectedValue(new Error("some Error"));
    mockPublishJob.mockResolvedValue("tx-id");
    const { result } = renderHook(() => useQueue({ config, formEntries }));
    await act(async () => {
      await result.current.processDocuments(QueueType.ISSUE);
    });

    expect(result.current.error).toStrictEqual(new Error("some Error"));
  });

  it("should revoke correctly and inserted into successfulProcessedDocuments", async () => {
    mockGetRevokeJobs.mockReturnValueOnce(sampleRevokeJobs);
    mockRevokeJob.mockResolvedValue("tx-id");
    const { result } = renderHook(() => useQueue({ config, documents: revokeDocumentEntries }));
    await act(async () => {
      await result.current.processDocuments(QueueType.REVOKE);
    });
    expect(result.current.queueState).toBe(QueueState.CONFIRMED);
    expect(result.current.successfulProcessedDocuments).toHaveLength(1);
  });

  it("should file failed jobs to failedProcessedDocuments for revoke flow", async () => {
    mockGetRevokeJobs.mockReturnValueOnce(sampleRevokeJobs);
    mockRevokeJob.mockResolvedValue("tx-id");
    mockRevokeJob.mockRejectedValueOnce(new Error("Some error"));
    const { result } = renderHook(() => useQueue({ config, documents: revokeDocumentEntries }));
    await act(async () => {
      await result.current.processDocuments(QueueType.REVOKE);
    });
    expect(result.current.failedProcessedDocuments).toHaveLength(1);
  });

  it("should have an error if getRevokeJobs throw error", async () => {
    mockGetRevokeJobs.mockRejectedValue(new Error("Some error"));
    mockRevokeJob.mockResolvedValue("tx-id");
    const { result } = renderHook(() => useQueue({ config, documents: revokeDocumentEntries }));
    await act(async () => {
      await result.current.processDocuments(QueueType.REVOKE);
    });

    expect(result.current.error).toStrictEqual(new Error("Some error"));
  });
});
