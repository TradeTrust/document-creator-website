import {
  wrapDocuments as wrapDocumentsV2,
  __unsafe__use__it__at__your__own__risks__wrapDocuments as wrapDocumentsV3,
  utils,
} from "@govtechsg/open-attestation";
import { defaultsDeep, groupBy } from "lodash";
import { IdentityProofType } from "../../../../constants";
import { ActionsUrlObject, Config, DocumentStorage, FormEntry, PublishingJob, RawDocument } from "../../../../types";
import { getQueueNumber } from "../../../API/storageAPI";
import { encodeQrCode } from "../../../utils";
import { Signer } from "ethers";
import { publishDnsDidVerifiableDocumentJob } from "../../../../services/publishing";
import { getIssuerAddress, isDocumentByIdentityProofType } from "../../../../utils";

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
      let formData;
      if (utils.isRawV3Document(data.formData)) {
        formData = {
          ...data.formData,
          credentialSubject: { ...data.formData.credentialSubject, ...qrUrl },
        };
      } else {
        formData = { ...data.formData, ...qrUrl };
      }
      defaultsDeep(formData, formDefaults);
      const contractAddress = getIssuerAddress(formData) as string; // type `OpenAttestationDocument` conflicts with `RawDocument`
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

const wrapDocuments = async (rawDocuments: any[]) => {
  return utils.isRawV3Document(rawDocuments[0]) ? await wrapDocumentsV3(rawDocuments) : wrapDocumentsV2(rawDocuments);
};

const processVerifiableDocuments = async (
  nonce: number,
  contractAddress: string,
  verifiableDocuments: RawDocument[]
): Promise<PublishingJob> => {
  const rawOpenAttestationDocuments = verifiableDocuments.map((doc) => doc.rawDocument);
  const wrappedDocuments = await wrapDocuments(rawOpenAttestationDocuments);
  const firstWrappedDocument = wrappedDocuments[0];
  const merkleRoot = utils.getMerkleRoot(firstWrappedDocument);
  const firstRawDocument = verifiableDocuments[0];
  return {
    type: firstRawDocument.type,
    nonce,
    contractAddress,
    documents: verifiableDocuments.map((doc, index) => ({
      ...doc,
      wrappedDocument: wrappedDocuments[index],
    })),
    merkleRoot: merkleRoot,
    payload: {},
  };
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
  const verifiableDocumentsDnsTxt = rawDocuments
    .filter((doc) => doc.type === "VERIFIABLE_DOCUMENT")
    .filter((doc) => isDocumentByIdentityProofType(doc.rawDocument, IdentityProofType.DNSTxt));
  const verifiableDocumentsDnsTxtBatched = Object.keys({
    ...groupBy(verifiableDocumentsDnsTxt, "contractAddress"),
  });

  const verifiableDocumentsDnsDid = rawDocuments
    .filter((doc) => doc.type === "VERIFIABLE_DOCUMENT")
    .filter((doc) => isDocumentByIdentityProofType(doc.rawDocument, IdentityProofType.DNSDid));

  let nonce = currentNonce;

  const jobs: PublishingJob[] = [];
  // Process all verifiable documents with DNS-TXT
  for (const contractAddress of verifiableDocumentsDnsTxtBatched) {
    const verifiableDocumentJob = await processVerifiableDocuments(nonce, contractAddress, verifiableDocumentsDnsTxt);
    jobs.push(verifiableDocumentJob);
    nonce += TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS;
  }

  // Process all verifiable documents with DNS-DID
  if (verifiableDocumentsDnsDid.length > 0) {
    const didRawDocuments = verifiableDocumentsDnsDid.map((doc) => doc.rawDocument);
    const wrappedDnsDidDocuments = await wrapDocuments(didRawDocuments);
    // Sign DNS-DID document here as we preparing the jobs
    const signedDnsDidDocument = await publishDnsDidVerifiableDocumentJob(wrappedDnsDidDocuments, signer);
    jobs.push({
      type: verifiableDocumentsDnsDid[0].type,
      nonce,
      contractAddress: IdentityProofType.DNSDid,
      documents: verifiableDocumentsDnsDid.map((doc, index) => ({
        ...doc,
        wrappedDocument: signedDnsDidDocument[index],
      })),
      merkleRoot: wrappedDnsDidDocuments[0].signature?.merkleRoot,
      payload: {},
    });
    nonce += TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS;
  }

  // Process all transferable records
  for (const transferableRecord of transferableRecords) {
    const { type, contractAddress, rawDocument, payload } = transferableRecord;
    const transferableDocuments = await wrapDocuments([rawDocument]);
    const merkleRoot = utils.getMerkleRoot(transferableDocuments[0]);

    jobs.push({
      type,
      nonce,
      contractAddress,
      documents: [{ ...transferableRecord, wrappedDocument: transferableDocuments[0] }],
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
  return groupDocumentsIntoJobs(rawDocuments, nonce, signer);
};
