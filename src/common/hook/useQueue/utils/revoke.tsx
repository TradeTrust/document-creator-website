import { RevokingJob } from "../../../../types";
import { utils } from "@govtechsg/open-attestation";

export const getRevokingJobs = async (documents: any[]): Promise<RevokingJob[]> => {
  return Promise.all(
    documents.map(async (document) => ({
      contractAddress: getRevokeAddress(document),
      targetHash: utils.getTargetHash(document),
      documents,
    }))
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getRevokeAddress = (document: any) => {
  // for dns-did document with revocation store
  let revokeAddress = "";
  if (utils.isWrappedV2Document(document)) {
    const unwrappedDocument = utils.getData(document);
    const issuer = unwrappedDocument.issuers[0];
    revokeAddress = issuer.revocation?.location || "";
    console.log(`1revokeAddress, ${revokeAddress}`);
  } else if (utils.isWrappedV3Document(document)) {
    console.log(`document2, ${JSON.stringify(document)}`);
    revokeAddress = document.openAttestationMetadata.proof.revocation?.location || "";
    revokeAddress = document.openAttestationMetadata.proof.revocation?.location || "";
    console.log(`2revokeAddress, ${revokeAddress}`);
  }
  // for dns-txt document with document store
  if (!revokeAddress) {
    revokeAddress = utils.getIssuerAddress(document)[0];

    revokeAddress = revokeAddress || document.openAttestationMetadata.proof.value || "";
    console.log(`3revokeAddress, ${revokeAddress}`);
  }

  return revokeAddress;
};
