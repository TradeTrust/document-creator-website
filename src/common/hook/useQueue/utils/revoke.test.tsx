import sampleV2DidDocument from "../../../../test/fixtures/sample-files/v2/did/sample-v2-did-wrapped.json";
import sampleWrappedDocument from "../../../../test/fixtures/sample-files/v2/wrapped/sample-wrapped-document.json";
import sampleV3DidDocument from "../../../../test/fixtures/sample-files/v3/did/sample-v3-did-wrapped.json";
import sampleV4DidDocument from "../../../../test/fixtures/sample-files/v4/did/sample-v4-did-signed.json";
import { getRevokeAddress, getRevokingJobs } from "./revoke";

describe("getRevokingJobs", () => {
  it("should return an array with the revoking jobs", async () => {
    const revokingJobs = await getRevokingJobs([sampleWrappedDocument]);

    expect(revokingJobs).toHaveLength(1);
    expect(revokingJobs[0].contractAddress).toBe("0x4Bf7E4777a8D1b6EdD5F2d9b8582e2817F0B0953");
    expect(revokingJobs[0].targetHash).toBe("234b7ce4c0da62206b2fc728c4b2aa8a45640df9deb51463189a9fbe4be4f52a");
    expect(revokingJobs[0].documents).toStrictEqual([sampleWrappedDocument]);
  });
});

describe("getRevokeAddress", () => {
  it("should get the document store for dns-txt verifiable document", () => {
    const revokeAddress = getRevokeAddress(sampleWrappedDocument);
    expect(revokeAddress).toBe("0x4Bf7E4777a8D1b6EdD5F2d9b8582e2817F0B0953");
  });

  it("should get the revocation store address for v2 dns-did verifiable document", () => {
    const revokeAddress = getRevokeAddress(sampleV2DidDocument);
    expect(revokeAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
  });

  it("should get the revocation store address for v3 dns-did verifiable document", () => {
    const revokeAddress = getRevokeAddress(sampleV3DidDocument);
    expect(revokeAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
  });

  it("should get the revocation store address for TTv4 DID verifiable document", () => {
    const revokeAddress = getRevokeAddress(sampleV4DidDocument);
    expect(revokeAddress).toBe("0xA594f6e10564e87888425c7CC3910FE1c800aB0B");
  });
});
