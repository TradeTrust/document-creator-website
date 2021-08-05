import { act, renderHook } from "@testing-library/react-hooks";
import { getDefaultProvider, Wallet } from "ethers";
import { RevokeState } from "../../../constants/RevokeState";
import { revokeDocumentJob } from "../../../services/revoking";
import sampleConfig from "../../../test/fixtures/sample-config-ropsten.json";
import sampleJobs from "../../../test/fixtures/sample-revoke-jobs.json";
import { Config } from "../../../types";
import { useRevokeQueue } from "./useRevokeQueue";
import { getRevokingJobs } from "./utils/revoke";
import sampleWrappedDocument from "../../../test/fixtures/sample-wrapped-document.json";

jest.mock("../../../services/revoking");
jest.mock("./utils/revoke");

const mockRevokeJob = revokeDocumentJob as jest.Mock;
const mockGetRevokeJobs = getRevokingJobs as jest.Mock;

const config = {
  ...sampleConfig,
  wallet: Wallet.createRandom().connect(getDefaultProvider("ropsten")),
} as Config;

const revokeDocumentEntries = [sampleWrappedDocument];

describe("useRevokeQueue", () => {
  it("should have the correct initial state", () => {
    const { result } = renderHook(() => useRevokeQueue(config, revokeDocumentEntries));
    expect(result.current.revokeState).toBe(RevokeState.UNINITIALIZED);
    expect(result.current.revokedDocuments).toStrictEqual([]);
  });

  it("should revoke correctly and correctly inserted into revokedDocuments", async () => {
    mockGetRevokeJobs.mockReturnValueOnce(sampleJobs);
    mockRevokeJob.mockResolvedValue("tx-id");
    const { result } = renderHook(() => useRevokeQueue(config, revokeDocumentEntries));
    await act(async () => {
      await result.current.revoke();
    });
    expect(result.current.revokeState).toBe(RevokeState.CONFIRMED);
    expect(result.current.revokedDocuments).toHaveLength(1);
  });

  it("should file failed jobs to failRevokeDocuments", async () => {
    mockGetRevokeJobs.mockReturnValueOnce(sampleJobs);
    mockRevokeJob.mockResolvedValue("tx-id");
    mockRevokeJob.mockRejectedValueOnce(new Error("Some error"));
    const { result } = renderHook(() => useRevokeQueue(config, revokeDocumentEntries));
    await act(async () => {
      await result.current.revoke();
    });
    expect(result.current.failedRevokedDocuments).toHaveLength(1);
  });

  it("should have an error if getRevokeJobs throw error", async () => {
    mockGetRevokeJobs.mockRejectedValue(new Error("Some error"));
    mockRevokeJob.mockResolvedValue("tx-id");
    const { result } = renderHook(() => useRevokeQueue(config, revokeDocumentEntries));
    await act(async () => {
      await result.current.revoke();
    });

    expect(result.current.error).toStrictEqual(new Error("Some error"));
  });
});
