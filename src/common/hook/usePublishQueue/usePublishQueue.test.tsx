import { renderHook, act } from "@testing-library/react-hooks";
import { usePublishQueue } from "./index";
import { publishJob } from "../../../services/publishing";
import { getPublishingJobs } from "./utils/publish";
import sampleConfig from "../../../test/fixtures/sample-config.json";
import sampleJobs from "../../../test/fixtures/sample-jobs.json";
import { Config, FormEntry } from "../../../types";
import { Wallet, getDefaultProvider } from "ethers";

jest.mock("../../../services/publishing");
jest.mock("./utils/publish");

const mockPublishJob = publishJob as jest.Mock;
const mockGetPublishingJobs = getPublishingJobs as jest.Mock;

const config = {
  ...sampleConfig,
  wallet: Wallet.createRandom().connect(getDefaultProvider("ropsten")),
} as Config;

const formEntires: FormEntry[] = [
  {
    fileName: "document-1.tt",
    templateIndex: 0,
    data: {
      formData: { foo: "bar" },
    },
    ownershipData: { holderAddress: "", beneficiaryAddress: "" },
  },
  {
    fileName: "document-2.tt",
    templateIndex: 0,
    data: {
      formData: { foo: "bar" },
    },
    ownershipData: { holderAddress: "", beneficiaryAddress: "" },
  },
];

describe("usePublishQueue", () => {
  it("should have the correct initial state", () => {
    const { result } = renderHook(() => usePublishQueue(config, formEntires));
    expect(result.current.publishState).toBe("UNINITIALIZED");
    expect(result.current.publishedDocuments).toStrictEqual([]);
  });

  it("should publish correctly", async () => {
    mockGetPublishingJobs.mockReturnValueOnce(sampleJobs);
    mockPublishJob.mockResolvedValue("tx-id");
    const { result } = renderHook(() => usePublishQueue(config, formEntires));
    await act(async () => {
      await result.current.publish();
    });
    expect(result.current.publishState).toBe("CONFIRMED");
    expect(result.current.publishedDocuments).toHaveLength(3);
  });

  it("should display all documents which were published in spite of errors", async () => {
    mockGetPublishingJobs.mockReturnValueOnce(sampleJobs);
    mockPublishJob.mockRejectedValueOnce(new Error("Boom!"));
    mockPublishJob.mockResolvedValueOnce("tx-id");
    const { result } = renderHook(() => usePublishQueue(config, formEntires));
    await act(async () => {
      await result.current.publish();
    });
    // expect(result.current.error).toBe("Boom!");
    expect(result.current.publishState).toBe("CONFIRMED");
    expect(result.current.publishedDocuments).toHaveLength(1);
  });
});
