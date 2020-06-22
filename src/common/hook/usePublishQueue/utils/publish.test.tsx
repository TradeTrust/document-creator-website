import sampleForms from "./sample-forms.json";
import sampleFormatted from "./sample-formated.json";
import sampleConfigFile from "../../../../test/fixtures/sample-config.json";
import { Config } from "../../../../types";
import { getPublishingQueue, getRawDocuments } from "./publish";

const sampleConfig = {
  ...sampleConfigFile,
  wallet: "FAKE_WALLET" as any,
} as Config;

describe("getRawDocuments", () => {
  it("should get raw documents with default values", () => {
    expect(getRawDocuments(sampleForms, sampleConfig)).toEqual(sampleFormatted);
  });
});

describe("getPublishingQueue", () => {
  it("should return the contract type, merkle root, contract address & forms in that batch", () => {
    const [wrappedDocuments] = getPublishingQueue(sampleForms, sampleConfig);
    expect(wrappedDocuments.type).toBe("TRANSFERABLE_RECORD");
    expect(wrappedDocuments.forms.length).toBe(1);
    expect(wrappedDocuments.merkleRoot).toBeTruthy();
    expect(wrappedDocuments.contractAddress).toBe("0xc3E9eBc6aDA9BA4B4Ce65D71901Cb2307e9670cE");
  });
});
