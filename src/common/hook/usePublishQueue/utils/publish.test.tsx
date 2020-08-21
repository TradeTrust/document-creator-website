import { Config, RawDocument } from "../../../../types";
import { getQueueNumber } from "../../../API/storageAPI";
import { getRawDocuments, groupDocumentsIntoJobs } from "./publish";
import sampleConfigFile from "./sample-config.json";
import sampleFormatted from "./sample-formatted.json";
import sampleForms from "./sample-forms.json";

const sampleConfig = {
  ...sampleConfigFile,
  wallet: "FAKE_WALLET" as any,
} as Config;

jest.mock("../../../API/storageAPI");
const mockGetQueueNumber = getQueueNumber as jest.Mock;

describe("getRawDocuments", () => {
  it("should get raw documents with default values", async () => {
    mockGetQueueNumber.mockResolvedValue({ data: { id: "123", key: "123" } });
    expect(await getRawDocuments(sampleForms, sampleConfig)).toStrictEqual(sampleFormatted);
  });
});

describe("groupDocumentsIntoJobs", () => {
  it("should batch transactions accordingly and return the jobs", () => {
    const publishingJobs = groupDocumentsIntoJobs(sampleFormatted as RawDocument[], 0);

    // One tx with 2 verifiable document
    // Two tx with 1 transferable records each
    expect(publishingJobs).toHaveLength(3);

    expect(publishingJobs[0].contractAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
    expect(publishingJobs[0].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[0].documents).toHaveLength(2);
    expect(publishingJobs[0].nonce).toBe(0);

    expect(publishingJobs[1].contractAddress).toBe("0x10E936e6BA85dC92505760259881167141365821");
    expect(publishingJobs[1].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[1].documents).toHaveLength(1);
    expect(publishingJobs[1].nonce).toBe(1);

    expect(publishingJobs[2].contractAddress).toBe("0x10E936e6BA85dC92505760259881167141365821");
    expect(publishingJobs[2].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[2].documents).toHaveLength(1);
    // Skipped 2 since the previous tx takes 2 transactions
    expect(publishingJobs[2].nonce).toBe(3);
  });
});
