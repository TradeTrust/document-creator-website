import {
  wrapDocuments,
  __unsafe__use__it__at__your__own__risks__wrapDocuments as wrapDocumentsV3,
  utils,
} from "@govtechsg/open-attestation";
import { defaultsDeep, groupBy } from "lodash";
import { identifyProofType } from "../../../../constants/QueueState";
import { ActionsUrlObject, Config, DocumentStorage, FormEntry, PublishingJob, RawDocument } from "../../../../types";
import { getQueueNumber } from "../../../API/storageAPI";
import { encodeQrCode } from "../../../utils";
import { Signer } from "ethers";
import { publishDnsDidVerifiableDocumentJob } from "../../../../services/publishing";

interface NetworkUrl {
  homestead: string;
  ropsten: string;
  rinkeby: string;
}

const getReservedStorageUrl = async (
  documentStorage: DocumentStorage,
  network: "homestead" | "ropsten" | "rinkeby"
): Promise<ActionsUrlObject> => {
  const queueNumber = await getQueueNumber(documentStorage);
  const networkUrl = {
    homestead: "https://tradetrust.io/",
    ropsten: "https://dev.tradetrust.io/",
    rinkeby: "https://rinkeby.tradetrust.io/",
  } as NetworkUrl;

  const qrUrlObj = {
    type: "DOCUMENT",
    payload: {
      uri: `${documentStorage.url}/${queueNumber.data.id}`,
      key: queueNumber.data.key,
      permittedActions: ["STORE"],
      redirect: networkUrl[network],
    },
  };

  const qrCodeObject = {
    links: {
      self: {
        href: encodeQrCode(qrUrlObj),
      },
    },
  };

  return qrCodeObject;
};

export const getRawDocuments = async (forms: FormEntry[], config: Config): Promise<RawDocument[]> => {
  return Promise.all(
    forms.map(async ({ data, templateIndex, fileName, ownership, extension }) => {
      let qrUrl = {};

      if (config.network !== "local") {
        if (config.documentStorage !== undefined) {
          qrUrl = await getReservedStorageUrl(config.documentStorage, config.network);
        }
      }

      const formConfig = config.forms[templateIndex];
      if (!formConfig) throw new Error("Form definition not found");
      const formDefaults = formConfig.defaults;
      const formData = { ...data.formData, ...qrUrl };
      defaultsDeep(formData, formDefaults);

      let contractAddress = "";
      if (utils.isRawV3Document(formData)) {
        contractAddress =
          formData.openAttestationMetadata.identityProof.type.toString() === identifyProofType.DnsDid
            ? identifyProofType.DnsDid
            : formData.openAttestationMetadata.proof.value;
      } else {
        contractAddress =
          formData.issuers[0]?.identityProof?.type === identifyProofType.DnsDid
            ? identifyProofType.DnsDid
            : formData.issuers[0]?.documentStore || formData.issuers[0]?.tokenRegistry;
      }
      const payload = formConfig.type === "TRANSFERABLE_RECORD" ? { ownership } : {};
      return {
        type: formConfig.type,
        contractAddress,
        rawDocument: formData,
        fileName,
        payload,
        extension,
      };
    })
  );
};

const TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS = 1;
const TX_NEEDED_FOR_TRANSFERABLE_RECORDS = 2;

// Given a list of documents, create a list of jobs
export const groupDocumentsIntoJobs = async (
  rawDocuments: RawDocument[],
  currentNonce: number,
  signer: Signer
): Promise<PublishingJob[]> => {
  const transferableRecords = rawDocuments.filter((doc) => doc.type === "TRANSFERABLE_RECORD");
  const verifiableDocuments = rawDocuments.filter((doc) => doc.type === "VERIFIABLE_DOCUMENT");
  const groupedVerifiableDocuments = groupBy(verifiableDocuments, "contractAddress");
  const verifiableDocumentsWithDocumentStore = { ...groupedVerifiableDocuments };
  delete verifiableDocumentsWithDocumentStore[identifyProofType.DnsDid];
  const verifiableDocumentsWithDnsDid =
    Object.keys(groupedVerifiableDocuments).indexOf(identifyProofType.DnsDid) >= 0
      ? [...groupedVerifiableDocuments[identifyProofType.DnsDid]]
      : [];
  const documentStoreAddresses = Object.keys(verifiableDocumentsWithDocumentStore);
  let nonce = currentNonce;

  const jobs: PublishingJob[] = [];
  // Process all verifiable documents with document store first
  for (const contractAddress of documentStoreAddresses) {
    const firstRawDocument = verifiableDocumentsWithDocumentStore[contractAddress][0];
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const rawDocuments = verifiableDocumentsWithDocumentStore[contractAddress].map((doc) => doc.rawDocument);

    const wrappedDocuments = utils.isRawV3Document(rawDocuments[0])
      ? await wrapDocumentsV3(rawDocuments)
      : wrapDocuments(rawDocuments);

    const firstWrappedDocument = wrappedDocuments[0];
    const merkleRoot = utils.getMerkleRoot(firstWrappedDocument);

    jobs.push({
      type: firstRawDocument.type,
      nonce,
      contractAddress,
      documents: verifiableDocumentsWithDocumentStore[contractAddress].map((doc, index) => ({
        ...doc,
        wrappedDocument: wrappedDocuments[index],
      })),
      merkleRoot: merkleRoot,
      payload: {},
    });
    nonce += TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS;
  }

  // Process all verifiable document with DNS-DID next
  if (verifiableDocumentsWithDnsDid.length > 0) {
    const didRawDocuments = verifiableDocumentsWithDnsDid.map((doc) => doc.rawDocument);
    const wrappedDnsDidDocuments = utils.isRawV3Document(didRawDocuments[0])
      ? await wrapDocumentsV3(didRawDocuments)
      : wrapDocuments(didRawDocuments);
    // Sign DNS-DID document here as we preparing the jobs
    const signedDnsDidDocument = await publishDnsDidVerifiableDocumentJob(wrappedDnsDidDocuments, signer);
    jobs.push({
      type: verifiableDocumentsWithDnsDid[0].type,
      nonce,
      contractAddress: identifyProofType.DnsDid,
      documents: verifiableDocumentsWithDnsDid.map((doc, index) => ({
        ...doc,
        wrappedDocument: signedDnsDidDocument[index],
      })),
      merkleRoot: wrappedDnsDidDocuments[0].signature?.merkleRoot,
      payload: {},
    });
    nonce += TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS;
  }

  // Process all transferable records next
  for (const transferableRecord of transferableRecords) {
    const { type, contractAddress, rawDocument, payload } = transferableRecord;

    const documents = utils.isRawV3Document(rawDocument)
      ? await wrapDocumentsV3([rawDocument])
      : wrapDocuments([rawDocument]);

    const merkleRoot = utils.getMerkleRoot(documents[0]);
    jobs.push({
      type,
      nonce,
      contractAddress,
      documents: [{ ...transferableRecord, wrappedDocument: documents[0] }],
      merkleRoot: merkleRoot,
      payload,
    });
    nonce += TX_NEEDED_FOR_TRANSFERABLE_RECORDS;
  }

  return jobs;
};

export const getPublishingJobs = async (
  forms: FormEntry[],
  config: Config,
  nonce: number,
  signer: Signer
): Promise<PublishingJob[]> => {
  // Currently works for only multiple verifiable document issuance:
  const rawDocuments = await getRawDocuments(forms, config);
  return await groupDocumentsIntoJobs(rawDocuments, nonce, signer);
};
