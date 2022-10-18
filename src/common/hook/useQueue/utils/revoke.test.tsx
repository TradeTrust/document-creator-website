import sampleV2DidDocument from "../../../../test/fixtures/sample-files/v2/did/sample-v2-did-wrapped.json";
import sampleWrappedDocument from "../../../../test/fixtures/sample-files/v2/wrapped/sample-wrapped-document.json";
import sampleV3DidDocument from "../../../../test/fixtures/sample-files/v3/did/sample-v3-did-wrapped.json";
import { getRevokeAddress, getRevokingJobs } from "./revoke";

describe("getRevokingJobs", () => {
  it("should return an array with the revoking jobs", async () => {
    const revokingJobs = await getRevokingJobs([sampleWrappedDocument]);

    expect(revokingJobs).toHaveLength(1);
    expect(revokingJobs[0].contractAddress).toBe("0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD");
    expect(revokingJobs[0].targetHash).toBe("b8e437deeb17060a67d6879789283687078080045b189a0f49c9f632534be04c");
    expect(revokingJobs[0].documents).toStrictEqual([sampleWrappedDocument]);
  });
});

describe("getRevokeAddress", () => {
  it("should get the document store for dns-txt verifiable document", () => {
    const revokeAddress = getRevokeAddress(sampleWrappedDocument);
    expect(revokeAddress).toBe("0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD");
  });

  it("should get the revocation store address for v2 dns-did verifiable document", () => {
    const revokeAddress = getRevokeAddress(sampleV2DidDocument);
    expect(revokeAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
  });

  it("should get the revocation store address for v3 dns-did verifiable document", () => {
    const revokeAddress = getRevokeAddress(sampleV3DidDocument);
    expect(revokeAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
  });
});
