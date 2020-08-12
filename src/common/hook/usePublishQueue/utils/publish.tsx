import { wrapDocuments } from "@govtechsg/open-attestation";
import { defaultsDeep, groupBy } from "lodash";
import { ActionsUrlObject, Config, FormEntry, PublishingJob, RawDocument } from "../../../../types";
import { getLogger } from "../../../../utils/logger";
import { getQueueNumber } from "../../../API/storageAPI";
import { encodeQrCode } from "../../../utils";

const { stack } = getLogger("getPublishQueue");

const QR_CODE_OBJECT = { links: { self: { href: "" } } };

interface QueueNumberTypes {
  id: string;
  key: string;
}

//TODO: replace this hardcoded url with the one in the config.json in another story
const STORAGE_ENDPOINT = "https://api-ropsten.tradetrust.io/storage";

const getReservedStorageUrl = async (
  storageEndpoint: string,
  network: string
): Promise<ActionsUrlObject> => {
  let queueNumber;

  try {
    queueNumber = await getQueueNumber(storageEndpoint);
  } catch (e) {
    stack(e);
    throw e;
  }

  const qrUrlObj = {
    type: "DOCUMENT",
    payload: {
      uri: `${STORAGE_ENDPOINT}/${queueNumber.id}`,
      key: queueNumber.key,
      permittedActions: ["STORE"],
      redirect: `https://${network === "homestead" ? "" : "dev."}tradetrust.io/`,
    },
  };

  QR_CODE_OBJECT.links.self.href = encodeQrCode(qrUrlObj);

  return QR_CODE_OBJECT;
};

export const getRawDocuments = async (
  forms: FormEntry[],
  config: Config
): Promise<RawDocument[]> => {
  return Promise.all(
    forms.map(async ({ data, templateIndex, fileName, ownership }) => {
      let qrUrl;
      try {
        qrUrl = await getReservedStorageUrl(STORAGE_ENDPOINT, config.network);
      } catch (e) {
        stack(e);
        qrUrl = QR_CODE_OBJECT;
      }

      const formConfig = config.forms[templateIndex];
      if (!formConfig) throw new Error("Form definition not found");
      const formDefaults = formConfig.defaults;
      const formData = { ...data.formData, ...qrUrl };
      defaultsDeep(formData, formDefaults);
      const contractAddress =
        formData.issuers[0]?.documentStore || formData.issuers[0]?.tokenRegistry;
      const payload = formConfig.type === "TRANSFERABLE_RECORD" ? { ownership } : {};
      return {
        type: formConfig.type,
        contractAddress,
        rawDocument: formData,
        fileName,
        payload,
      };
    })
  );
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
      payload: {},
    });
    nonce += TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS;
  });

  // Process all transferable records next
  transferableRecords.forEach((transferableRecord) => {
    const { type, contractAddress, rawDocument, payload } = transferableRecord;
    const documents = wrapDocuments([rawDocument]);
    jobs.push({
      type,
      nonce,
      contractAddress,
      documents: [{ ...transferableRecord, wrappedDocument: documents[0] }],
      merkleRoot: documents[0].signature?.merkleRoot,
      payload,
    });
    nonce += TX_NEEDED_FOR_TRANSFERABLE_RECORDS;
  });

  return jobs;
};

export const getPublishingJobs = async (
  forms: FormEntry[],
  config: Config,
  nonce: number
): Promise<PublishingJob[]> => {
  // Currently works for only multiple verifiable document issuance:
  const rawDocuments = await getRawDocuments(forms, config);
  return groupDocumentsIntoJobs(rawDocuments, nonce);
};
