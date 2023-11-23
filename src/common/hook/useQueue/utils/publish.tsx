import {
  utils,
  wrapDocuments as wrapDocumentsV2,
  __unsafe__use__it__at__your__own__risks__wrapDocuments as wrapDocumentsV3,
} from "@tradetrust-tt/tradetrust";
import { Signer } from "ethers";
import { defaultsDeep, groupBy } from "lodash";
import { IdentityProofType } from "../../../../constants";
import { publishDnsDidVerifiableDocumentJob } from "../../../../services/publishing";
import {
  ActionsUrlObject,
  Config,
  DocumentStorage,
  FormEntry,
  Network,
  PublishingJob,
  RawDocument,
} from "../../../../types";
import { getQueueNumber } from "../../../API/storageAPI";
import { encodeQrCode, getDataV3, getDocumentNetwork } from "../../../utils";
import { ChainInfo } from "../../../../constants/chainInfo";

const redirectUrl = (network: Network) => {
  if (network === "homestead" || network === "matic") return "https://tradetrust.io/";
  return "https://dev.tradetrust.io/";
};

const getReservedStorageUrl = async (documentStorage: DocumentStorage, network: Network): Promise<ActionsUrlObject> => {
  const queueNumber = await getQueueNumber(documentStorage);
  const chainObject = Object.values(ChainInfo).find((item) => item.networkName === network);

  const qrUrlObj = {
    type: "DOCUMENT",
    payload: {
      uri: `${documentStorage.url}/${queueNumber.data.id}`,
      key: queueNumber.data.key,
      permittedActions: ["STORE"],
      redirect: redirectUrl(network),
      chainId: `${chainObject?.chainId}`,
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

const getContractAddressFromRawDoc = (document: any) => {
  if (utils.isRawV3Document(document)) {
    return document.openAttestationMetadata.identityProof.type.toString() === IdentityProofType.DNSDid
      ? IdentityProofType.DNSDid
      : document.openAttestationMetadata.proof.value;
  } else {
    return document.issuers[0]?.identityProof?.type === IdentityProofType.DNSDid
      ? IdentityProofType.DNSDid
      : document.issuers[0]?.documentStore || document.issuers[0]?.tokenRegistry;
  }
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
      const documentNetwork = getDocumentNetwork(config.network);
      let formData;
      if (utils.isRawV3Document(data.formData)) {
        formData = {
          ...documentNetwork,
          credentialSubject: { ...getDataV3(data.formData), ...qrUrl }, // https://github.com/TradeTrust/document-creator-website/issues/256, using `getDataV3` here so not to break existing flows
          ...(data.formData.attachments && { attachments: data.formData.attachments }),
        };
      } else {
        formData = { ...data.formData, ...qrUrl, ...documentNetwork };
      }
      defaultsDeep(formData, formDefaults);
      const contractAddress = getContractAddressFromRawDoc(formData);
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
  const verifiableDocuments = rawDocuments.filter((doc) => doc.type === "VERIFIABLE_DOCUMENT");
  const groupedVerifiableDocuments = groupBy(verifiableDocuments, "contractAddress");
  const verifiableDocumentsWithDocumentStore = { ...groupedVerifiableDocuments };
  delete verifiableDocumentsWithDocumentStore[IdentityProofType.DNSDid];
  const verifiableDocumentsWithDnsDid =
    Object.keys(groupedVerifiableDocuments).indexOf(IdentityProofType.DNSDid) >= 0
      ? [...groupedVerifiableDocuments[IdentityProofType.DNSDid]]
      : [];
  const documentStoreAddresses = Object.keys(verifiableDocumentsWithDocumentStore);

  let nonce = currentNonce;

  const jobs: PublishingJob[] = [];
  // Process all verifiable documents with document store first
  for (const contractAddress of documentStoreAddresses) {
    const verifiableDocumentsV2 = verifiableDocumentsWithDocumentStore[contractAddress].filter((docs) => {
      return utils.isRawV2Document(docs.rawDocument);
    });
    const verifiableDocumentsV3 = verifiableDocumentsWithDocumentStore[contractAddress].filter((docs) => {
      return utils.isRawV3Document(docs.rawDocument);
    });

    if (verifiableDocumentsV2.length > 0) {
      const verifiableDocumentV2Job = await processVerifiableDocuments(nonce, contractAddress, verifiableDocumentsV2);
      jobs.push(verifiableDocumentV2Job);
      nonce += TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS;
    }

    if (verifiableDocumentsV3.length > 0) {
      const verifiableDocumentV3Job = await processVerifiableDocuments(nonce, contractAddress, verifiableDocumentsV3);
      jobs.push(verifiableDocumentV3Job);
      nonce += TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS;
    }
  }

  // Process all verifiable document with DNS-DID next
  if (verifiableDocumentsWithDnsDid.length > 0) {
    const didRawDocuments = verifiableDocumentsWithDnsDid.map((doc) => doc.rawDocument);
    const wrappedDnsDidDocuments = await wrapDocuments(didRawDocuments);
    // Sign DNS-DID document here as we preparing the jobs
    const signedDnsDidDocument = await publishDnsDidVerifiableDocumentJob(wrappedDnsDidDocuments, signer);
    jobs.push({
      type: verifiableDocumentsWithDnsDid[0].type,
      nonce,
      contractAddress: IdentityProofType.DNSDid,
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
