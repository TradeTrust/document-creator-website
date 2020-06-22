import { FormEntry, Config } from "../../../../types";
import { defaultsDeep } from "lodash";
import { wrapDocuments } from "@govtechsg/open-attestation";

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
        // Decided to throw after realising that we don't have beneficiary & holder yet
        throw new Error("Token Registry is not supported yet");
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

export const getPublishingQueue = (forms: FormEntry[], config: Config) => {
  // Currently assumes that the input is either:
  // 1. All verifiable documents with same document store
  // 2. One transferable record
  // We can eventually upgrade this to group the documents by the different document stores
  // and also to issue verifiable documents one by one. Just not now.
  const rawDocuments = getRawDocuments(forms, config);
  assertPublishingConstraintTemp(rawDocuments);

  // At this point, wrappedDocuments is either (because of assertPublishingConstraintTemp):
  // 1. array of 1 transferable record
  // 2. array of multiple verifiable documents
  const wrappedDocuments = wrapDocuments(rawDocuments);

  // TODO can swap assertPublishingConstraintTemp to regroup documents so that it can form a series
  // of transactions that can be published onto the blockchain with minimal transaction counts.
  // For that reason, we return an array first
  const firstDocumentType = config.forms[forms[0].templateIndex].type;
  const firstWrappedDocument = wrappedDocuments[0] as any;
  const merkleRoot = firstWrappedDocument?.signature?.merkleRoot;
  const contractAddress = rawDocuments[0].issuers[0].documentStore;
  return [
    {
      type: firstDocumentType,
      forms, // To get the file name back later
      documents: wrappedDocuments,
      merkleRoot,
      contractAddress,
      // To add beneficiary and holder here
    },
  ];
};
