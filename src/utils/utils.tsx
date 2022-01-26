import { Network, WrappedDocument } from "../types";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { utils, OpenAttestationDocument } from "@govtechsg/open-attestation";
import { getDocumentStoreRecords, getDnsDidRecords } from "@govtechsg/dnsprove";
import { FormTemplate } from "../types";
import { IdentityProofType } from "../constants";

interface GenerateFileName {
  network?: string;
  fileName: string;
  extension: string;
  hasTimestamp?: boolean;
}

export const generateFileName = ({ network, fileName, extension, hasTimestamp }: GenerateFileName): string => {
  const timestamp = new Date().toISOString();
  const fileNetwork = network === "homestead" ? "" : `-${network}`;
  const fileTimestamp = hasTimestamp ? `-${timestamp}` : "";
  return `${fileName}${fileNetwork}${fileTimestamp}.${extension}`;
};

export const generateZipFile = (documents: WrappedDocument[], network: string | undefined = ""): void => {
  const zip = new JSZip();
  documents.forEach((document) => {
    const file = JSON.stringify(document.wrappedDocument, null, 2);
    const blob = new Blob([file], { type: "text/json;charset=utf-8" });

    zip.file(
      generateFileName({
        network: network,
        fileName: document.fileName,
        extension: document.extension,
      }),
      blob
    );
  });

  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(
      content,
      generateFileName({
        network: network,
        fileName: "Documents",
        extension: "zip",
        hasTimestamp: true,
      })
    );
  });
};

export const getFileSize = (jsonString: string): number => {
  const m = encodeURIComponent(jsonString).match(/%[89ABab]/g);
  return jsonString.length + (m ? m.length : 0);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createFileTransferEvent = (files: File[]) => {
  return {
    dataTransfer: {
      files,
      items: files.map((file: File) => ({
        kind: "file",
        size: file.size,
        type: file.type,
        getAsFile: () => file,
      })),
      types: ["Files"],
    },
  };
};

export const getNetworkPath = (network?: Network): string => {
  const homesteadUrlPath = "https://tradetrust.io";

  if (!network) {
    return homesteadUrlPath;
  }

  if (network === "ropsten") {
    return "https://dev.tradetrust.io";
  } else if (network === "homestead" || network === "local") {
    return homesteadUrlPath;
  } else {
    return `https://${network}.tradetrust.io`;
  }
};

export const getIssuerLocation = (rawDocument: OpenAttestationDocument): string | undefined => {
  if (utils.isRawV2Document(rawDocument)) {
    const { issuers } = rawDocument;
    return issuers[0].identityProof?.location; // let's assume only 1 issuer, so far no multiple issuer cases
  } else if (utils.isRawV3Document(rawDocument)) {
    return rawDocument.openAttestationMetadata.identityProof.identifier;
  }
  throw new Error(
    "Unsupported document type: Only can retrieve issuer location from OpenAttestation v2 & v3 documents."
  );
};

export const getIdentityProofType = (rawDocument: OpenAttestationDocument): string | undefined => {
  if (utils.isRawV2Document(rawDocument)) {
    const { issuers } = rawDocument;
    return issuers[0].identityProof?.type; // let's assume only 1 issuer, so far no multiple issuer cases
  } else if (utils.isRawV3Document(rawDocument)) {
    return rawDocument.openAttestationMetadata.identityProof.type;
  }
  throw new Error(
    "Unsupported document type: Only can retrieve IdentityProof type from OpenAttestation v2 & v3 documents."
  );
};

export const getIssuerAddress = (rawDocument: OpenAttestationDocument): string | undefined => {
  if (utils.isRawV2Document(rawDocument)) {
    const { issuers } = rawDocument;
    return (
      issuers[0].certificateStore ||
      issuers[0].documentStore ||
      issuers[0].tokenRegistry ||
      issuers[0].identityProof?.key
    ); // let's assume only 1 issuer, so far no multiple issuer cases
  } else if (utils.isRawV3Document(rawDocument)) {
    return rawDocument.openAttestationMetadata.proof.value;
  }
  throw new Error(
    "Unsupported document type: Only can retrieve issuer address from OpenAttestation v2 & v3 documents."
  );
};

interface ValidateDnsTxtRecords {
  identityProofType: string;
  issuerLocation: string;
  issuerAddress: string;
}

export const validateDnsTxtRecords = async ({
  identityProofType,
  issuerLocation,
  issuerAddress,
}: ValidateDnsTxtRecords): Promise<boolean> => {
  if (identityProofType === IdentityProofType.DNSDid) {
    const txtRecords = await getDnsDidRecords(issuerLocation);
    return txtRecords.some((record) => record.publicKey.toLowerCase() === issuerAddress.toLowerCase());
  } else if (identityProofType === IdentityProofType.DNSTxt) {
    const txtRecords = await getDocumentStoreRecords(issuerLocation);
    return txtRecords.some((record) => record.addr.toLowerCase() === issuerAddress.toLowerCase());
  }
  return false;
};

export const validateDns = async (form: FormTemplate): Promise<boolean> => {
  const formData = form.defaults;
  const issuerLocation = getIssuerLocation(formData);
  const identityProofType = getIdentityProofType(formData);
  const issuerAddress = getIssuerAddress(formData);
  if (identityProofType === undefined || issuerLocation === undefined || issuerAddress === undefined) {
    console.error("identityProofType, issuerLocation or issuerAddress is missing");
    return false;
  }
  return await validateDnsTxtRecords({ identityProofType, issuerLocation, issuerAddress });
};
