import { FormEntry, Config, RawDocument, PublishingJob } from "../../../../types";
import { defaultsDeep, groupBy } from "lodash";
import { wrapDocuments } from "@govtechsg/open-attestation";

// Temporary method to enforce the publishing constraint
export const assertPublishingConstraintTemp = (documents: RawDocument[]) => {
  documents.forEach(({ rawDocument }) => {
    rawDocument.issuers.forEach((issuer: any) => {
      if (issuer.tokenRegistry) {
        throw new Error("Token Registry is not supported yet");
      }
    });
  });
};

export const getRawDocuments = (forms: FormEntry[], config: Config): RawDocument[] => {
  return forms.map(({ data, templateIndex, fileName }) => {
    const formConfig = config.forms[templateIndex];
    if (!formConfig) throw new Error("Form definition not found");
    const formDefaults = formConfig.defaults;
    const formData = { ...data.formData };
    defaultsDeep(formData, formDefaults);
    const contractAddress =
      formData.issuers[0]?.documentStore || formData.issuers[0]?.tokenRegistry;
    return {
      type: "VERIFIABLE_DOCUMENT", // To extend to transferable records next time
      contractAddress,
      rawDocument: formData,
      fileName,
      payload: {}, // For additional data like beneficiary and holder later
    };
  });
};

// Given a list of documents, create a list of jobs
export const groupDocumentsIntoJobs = (rawDocuments: RawDocument[]): PublishingJob[] => {
  // Below grouping assumes that a contract address cannot both be a document store and token registry.
  // Also need to be changed when verifiable document is added, since each one is it's own job queue.
  const grouped = groupBy(rawDocuments, "contractAddress");
  const contractAddresses = Object.keys(grouped);
  return contractAddresses.map((contractAddress) => {
    const firstRawDocument = grouped[contractAddress][0];
    const rawDocuments = grouped[contractAddress].map((doc) => doc.rawDocument);
    const wrappedDocuments = wrapDocuments(rawDocuments);
    const firstWrappedDocument = wrappedDocuments[0];
    return {
      type: firstRawDocument.type,
      contractAddress,
      documents: grouped[contractAddress].map((doc, index) => ({
        ...doc,
        wrappedDocument: wrappedDocuments[index],
      })),
      merkleRoot: firstWrappedDocument.signature?.merkleRoot,
    };
  });
};

export const getPublishingJobs = (forms: FormEntry[], config: Config) => {
  // Currently works for only multiple verifiable document issuance:
  const rawDocuments = getRawDocuments(forms, config);
  assertPublishingConstraintTemp(rawDocuments);

  return groupDocumentsIntoJobs(rawDocuments);
};
