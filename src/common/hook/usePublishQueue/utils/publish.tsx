import { FormEntry, Config, RawDocument, PublishingJob } from "../../../../types";
import { defaultsDeep, groupBy } from "lodash";
import { wrapDocuments } from "@govtechsg/open-attestation";

export const getRawDocuments = (forms: FormEntry[], config: Config): RawDocument[] => {
  return forms.map(({ data, templateIndex, fileName, ownershipData }) => {
    const formConfig = config.forms[templateIndex];
    if (!formConfig) throw new Error("Form definition not found");
    const formDefaults = formConfig.defaults;
    const formData = { ...data.formData };
    defaultsDeep(formData, formDefaults);
    const contractAddress =
      formData.issuers[0]?.documentStore || formData.issuers[0]?.tokenRegistry;
    const payload = formConfig.type === "TRANSFERABLE_RECORD" ? { ownershipData } : {};
    return {
      type: formConfig.type,
      contractAddress,
      rawDocument: formData,
      fileName,
      payload,
    };
  });
};

const TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS = 1;
const TX_NEEDED_FOR_TRANSFERABLE_RECORDS = 2;

// Given a list of documents, create a list of jobs
export const groupDocumentsIntoJobs = (
  rawDocuments: RawDocument[],
  currentNonce: number
): PublishingJob[] => {
  const transferableRecords = rawDocuments.filter((doc) => doc.type === "TRANSFERABLE_RECORD");
  const verifiableDocuments = rawDocuments.filter((doc) => doc.type === "VERIFIABLE_DOCUMENT");
  const groupedVerifiableDocuments = groupBy(verifiableDocuments, "contractAddress");
  const documentStoreAddresses = Object.keys(groupedVerifiableDocuments);
  let nonce = currentNonce;

  const jobs: PublishingJob[] = [];

  // Process all verifiable documents first
  documentStoreAddresses.forEach((contractAddress) => {
    const firstRawDocument = groupedVerifiableDocuments[contractAddress][0];
    const rawDocuments = groupedVerifiableDocuments[contractAddress].map((doc) => doc.rawDocument);
    const wrappedDocuments = wrapDocuments(rawDocuments);
    const firstWrappedDocument = wrappedDocuments[0];
    jobs.push({
      type: firstRawDocument.type,
      nonce,
      contractAddress,
      documents: groupedVerifiableDocuments[contractAddress].map((doc, index) => ({
        ...doc,
        wrappedDocument: wrappedDocuments[index],
      })),
      merkleRoot: firstWrappedDocument.signature?.merkleRoot,
    });
    nonce += TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS;
  });

  // Process all transferable records next
  transferableRecords.forEach((transferableRecord) => {
    const { type, contractAddress, rawDocument } = transferableRecord;
    const documents = wrapDocuments([rawDocument]);
    jobs.push({
      type,
      nonce,
      contractAddress,
      documents: [{ ...transferableRecord, wrappedDocument: documents[0] }],
      merkleRoot: documents[0].signature?.merkleRoot,
    });
    nonce += TX_NEEDED_FOR_TRANSFERABLE_RECORDS;
  });

  return jobs;
};

export const getPublishingJobs = (
  forms: FormEntry[],
  config: Config,
  nonce: number
): PublishingJob[] => {
  // Currently works for only multiple verifiable document issuance:
  const rawDocuments = getRawDocuments(forms, config);

  return groupDocumentsIntoJobs(rawDocuments, nonce);
};
