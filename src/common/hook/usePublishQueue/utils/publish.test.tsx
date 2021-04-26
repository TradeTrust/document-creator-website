import { Config, RawDocument } from "../../../../types";
import { getQueueNumber } from "../../../API/storageAPI";
import { getRawDocuments, groupDocumentsIntoJobs } from "./publish";
import sampleConfigFile from "./sample-config.json";
import sampleFormattedWithDnsDid from "./sample-formatted-with-dns-did.json";
import sampleFormattedWithoutQrUrl from "./sample-formatted-without-qr-url.json";
import sampleFormatted from "./sample-formatted.json";
import sampleForms from "./sample-forms.json";

const sampleConfig = {
  ...sampleConfigFile,
  wallet: "FAKE_WALLET" as any,
} as Config;

const configWithoutDocumentStorage = {
  ...sampleConfigFile,
  documentStorage: undefined,
  wallet: "FAKE_WALLET" as any,
} as Config;

jest.mock("../../../API/storageAPI");
const mockGetQueueNumber = getQueueNumber as jest.Mock;

describe("getRawDocuments", () => {
  it("should get raw documents with default values", async () => {
    mockGetQueueNumber.mockResolvedValue({ data: { id: "123", key: "123" } });
    expect(await getRawDocuments(sampleForms, sampleConfig)).toStrictEqual(sampleFormatted);
  });

  it("should not have any qr url when no documentStorage is present in config file", async () => {
    expect(await getRawDocuments(sampleForms, configWithoutDocumentStorage)).toStrictEqual(
      sampleFormattedWithoutQrUrl
    );
  });
});

describe("groupDocumentsIntoJobs", () => {
  it("should batch transactions accordingly and return the jobs without DNS-DID", () => {
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

  it("should batch transactions accordingly and return the jobs with DNS-DID", () => {
    const publishingJobs = groupDocumentsIntoJobs(sampleFormattedWithDnsDid as RawDocument[], 0);

    // One tx with 1 verifiable document
    // One tx with 1 verifiable DID document
    // Two tx with 1 transferable records each
    expect(publishingJobs).toHaveLength(4);

    expect(publishingJobs[0].contractAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
    expect(publishingJobs[0].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[0].documents).toHaveLength(1);
    expect(publishingJobs[0].nonce).toBe(0);

    expect(publishingJobs[1].contractAddress).toBe("DNS-DID");
    expect(publishingJobs[1].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[1].documents).toHaveLength(1);
    expect(publishingJobs[1].nonce).toBe(1);

    expect(publishingJobs[2].contractAddress).toBe("0x10E936e6BA85dC92505760259881167141365821");
    expect(publishingJobs[2].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[2].documents).toHaveLength(1);
    expect(publishingJobs[2].nonce).toBe(2);

    expect(publishingJobs[3].contractAddress).toBe("0x10E936e6BA85dC92505760259881167141365821");
    expect(publishingJobs[3].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[3].documents).toHaveLength(1);
    expect(publishingJobs[3].nonce).toBe(4);
  });
});
