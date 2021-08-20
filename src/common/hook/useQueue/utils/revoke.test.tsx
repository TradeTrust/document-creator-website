import { getRevokingJobs } from "./revoke";
import sampleWrappedDocument from "../../../../test/fixtures/sample-wrapped-document.json";

describe("getRevokingJobs", () => {
  it("should return an array with the revoking jobs", async () => {
    const revokingJobs = await getRevokingJobs([sampleWrappedDocument]);

    expect(revokingJobs).toHaveLength(1);
    expect(revokingJobs[0].contractAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
    expect(revokingJobs[0].targetHash).toBe("82018d4e6f3807fce0cb6a7c584c9477fdd1719746cbe74804608b7d0f982b7e");
    expect(revokingJobs[0].documents).toStrictEqual([sampleWrappedDocument]);
  });
});
