import { act, renderHook } from "@testing-library/react-hooks";
import { ethers, Wallet } from "ethers";
import { publishJob } from "../../../services/publishing";
import sampleConfig from "../../../test/fixtures/sample-config.json";
import sampleJobs from "../../../test/fixtures/sample-jobs.json";
import { Config, FormEntry } from "../../../types";
import { uploadToStorage } from "../../API/storageAPI";
import { usePublishQueue } from "./usePublishQueue";
import { getPublishingJobs } from "./utils/publish";

jest.mock("../../../services/publishing");
jest.mock("./utils/publish");
jest.mock("../../API/storageAPI");

const mockPublishJob = publishJob as jest.Mock;
const mockGetPublishingJobs = getPublishingJobs as jest.Mock;
const mockUploadToStorage = uploadToStorage as jest.Mock;

const config = {
  ...sampleConfig,
  wallet: Wallet.createRandom().connect(ethers.getDefaultProvider("ropsten")),
} as Config;

const formEntires: FormEntry[] = [
  {
    fileName: "document",
    templateIndex: 0,
    data: {
      formData: { foo: "bar" },
    },
    ownership: { holderAddress: "", beneficiaryAddress: "" },
  },
  {
    fileName: "document-2",
    templateIndex: 0,
    data: {
      formData: { foo: "bar" },
    },
    ownership: { holderAddress: "", beneficiaryAddress: "" },
  },
];

const uploadSuccess = {
  success: true,
  errorMsg: "",
};

describe("usePublishQueue", () => {
  it("should have the correct initial state", () => {
    const { result } = renderHook(() => usePublishQueue(config, formEntires));
    expect(result.current.publishState).toBe("UNINITIALIZED");
    expect(result.current.publishedDocuments).toStrictEqual([]);
  });

  it("should publish correctly", async () => {
    mockGetPublishingJobs.mockReturnValueOnce(sampleJobs);
    mockPublishJob.mockResolvedValue("tx-id");
    mockUploadToStorage.mockReturnValue(uploadSuccess);
    const { result } = renderHook(() => usePublishQueue(config, formEntires));
    await act(async () => {
      await result.current.publish();
    });
    expect(result.current.publishState).toBe("CONFIRMED");
    expect(result.current.publishedDocuments).toHaveLength(3);
  });

  it("should file failed jobs to failPublishedDocuments", async () => {
    mockGetPublishingJobs.mockReturnValueOnce(sampleJobs);
    mockPublishJob.mockResolvedValue("tx-id");
    mockPublishJob.mockRejectedValueOnce(new Error("Some error"));
    mockUploadToStorage.mockReturnValue(uploadSuccess);
    const { result } = renderHook(() => usePublishQueue(config, formEntires));
    await act(async () => {
      await result.current.publish();
    });
    expect(result.current.failedPublishedDocuments).toHaveLength(1);
  });

  it("should publish correctly if uploaded document is working", async () => {
    mockGetPublishingJobs.mockReturnValueOnce(sampleJobs);
    mockPublishJob.mockResolvedValue("tx-id");
    mockUploadToStorage.mockReturnValue(uploadSuccess);

    const { result } = renderHook(() => usePublishQueue(config, formEntires));
    await act(async () => {
      await result.current.publish();
    });

    expect(result.current.publishedDocuments).toHaveLength(3);
  });

  it("should have error if getPublishJobs throw error", async () => {
    mockGetPublishingJobs.mockRejectedValue(new Error("some Error"));
    mockPublishJob.mockResolvedValue("tx-id");
    const { result } = renderHook(() => usePublishQueue(config, formEntires));
    await act(async () => {
      await result.current.publish();
    });

    expect(result.current.error).toStrictEqual(new Error("some Error"));
  });
});
