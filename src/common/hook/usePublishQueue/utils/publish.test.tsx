import sampleForms from "./sample-forms.json";
import sampleFormatted from "./sample-formated.json";
import sampleConfigFile from "./sample-config.json";
import { Config, RawDocument } from "../../../../types";
import { getRawDocuments, groupDocumentsIntoJobs } from "./publish";

const sampleConfig = {
  ...sampleConfigFile,
  wallet: "FAKE_WALLET" as any,
} as Config;

describe("getRawDocuments", () => {
  it("should get raw documents with default values", () => {
    expect(getRawDocuments(sampleForms, sampleConfig)).toStrictEqual(sampleFormatted);
  });
});

describe("groupDocumentsIntoJobs", () => {
  it("should batch transactions accordingly and return the jobs", () => {
    const publishingJobs = groupDocumentsIntoJobs(sampleFormatted as RawDocument[], 0);
    
    expect(publishingJobs).toHaveLength(2);

    expect(publishingJobs[0].contractAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
    expect(publishingJobs[0].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[0].documents).toHaveLength(2);
    expect(publishingJobs[0].nonce).toBe(0);

    expect(publishingJobs[1].contractAddress).toBe("0x8AE02d36F5eE60604cf46C086b3Ad5Ac43137f58");
    expect(publishingJobs[1].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[1].documents).toHaveLength(1);
    expect(publishingJobs[1].nonce).toBe(1);
  });
});
