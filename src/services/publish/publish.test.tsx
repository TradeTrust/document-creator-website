import sampleForms from "./sample-forms.json";
import sampleFormatted from "./sample-formated.json";
import sampleConfigFile from "../../test/fixtures/sample-config.json";
import { FormEntry, Config } from "../../types";
import { defaultsDeep } from "lodash";
import { wrapDocuments } from "@govtechsg/open-attestation";

const sampleConfig = {
  ...sampleConfigFile,
  wallet: "FAKE_WALLET" as any,
} as Config;

// Temporary method to enforce the publishing constraint
export const assertPublishingConstraintTemp = (documents: any[]) => {
  const contractAddresses = new Set();
  let tokenRegistries = 0;
  let documentStores = 0;
  documents.forEach((doc) => {
    doc.issuers.forEach((issuer: any) => {
      if (issuer.tokenRegistry) {
        contractAddresses.add(issuer.tokenRegistry);
        tokenRegistries += 1;
      }
      if (issuer.documentStore) {
        contractAddresses.add(issuer.documentStore);
        documentStores += 1;
      }
    });
  });
  if (contractAddresses.size != 1) throw new Error("Can only publish to one contract for now");
  if (tokenRegistries > 1) throw new Error("Can only publish to one token registry for now");
  if (tokenRegistries > 0 && documentStores > 0)
    throw new Error("Can only publish to either token registry or document store for now");
};

export const getRawDocuments = (forms: FormEntry[], config: Config) => {
  return forms.map(({ data, templateIndex }) => {
    const formConfig = config.forms[templateIndex];
    if (!formConfig) throw new Error("Form definition not found");
    const formDefaults = formConfig.defaults;
    const formData = { ...data.formData };
    defaultsDeep(formData, formDefaults);
    return formData;
  });
};

export const getWrappedDocuments = (forms: FormEntry[], config: Config) => {
  // Currently assumes that the input is either:
  // 1. All verifiable documents with same document store
  // 2. One transferable record
  // We can eventually upgrade this to group the documents by the different document stores
  // and also to issue verifiable documents one by one. Just not now.
  const rawDocuments = getRawDocuments(forms, config);
  assertPublishingConstraintTemp(rawDocuments);

  // At this point, wrappedDocuments is either:
  // 1. array of 1 transferable record
  // 2. array of multiple verifiable documents
  const wrappedDocuments = wrapDocuments(rawDocuments);

  // Need to group documents together first?
  return {
      type: "",
      forms, // To get the file name back later
      documents: wrappedDocuments,
      merkleRoot: "",
      contractAddress: ""
  };
};

describe("getRawDocuments", () => {
  it("should get raw documents with default values", () => {
    expect(getRawDocuments(sampleForms, sampleConfig)).toEqual(sampleFormatted);
  });
});

it("works", () => {
  console.log(getWrappedDocuments(sampleForms, sampleConfig));
});
