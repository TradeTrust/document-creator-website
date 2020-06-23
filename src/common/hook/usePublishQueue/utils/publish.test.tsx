import sampleForms from "./sample-forms.json";
import sampleFormatted from "./sample-formated.json";
import sampleConfigFile from "./sample-config.json";
import { Config } from "../../../../types";
import { getRawDocuments, RawDocument, groupDocumentsIntoJobs } from "./publish";

const sampleConfig = {
  ...sampleConfigFile,
  wallet: "FAKE_WALLET" as any,
} as Config;

describe("getRawDocuments", () => {
  it("should get raw documents with default values", () => {
    expect(getRawDocuments(sampleForms, sampleConfig)).toEqual(sampleFormatted);
  });
});

describe("groupDocumentsIntoJobs", () => {
  it("should batch transactions accordingly and return the jobs", () => {
    const publishingJobs = groupDocumentsIntoJobs(sampleFormatted as RawDocument[]);

    console.log(JSON.stringify(publishingJobs, null, 2));

    expect(publishingJobs.length).toBe(2);

    expect(publishingJobs[0].contractAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
    expect(publishingJobs[0].merkleRoot).toBeTruthy();
    expect(publishingJobs[0].documents.length).toBe(2);

    expect(publishingJobs[1].contractAddress).toBe("0x8AE02d36F5eE60604cf46C086b3Ad5Ac43137f58");
    expect(publishingJobs[1].merkleRoot).toBeTruthy();
    expect(publishingJobs[1].documents.length).toBe(1);
  });
});
