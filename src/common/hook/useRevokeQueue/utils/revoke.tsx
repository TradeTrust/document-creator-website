import { RevokingJob } from "../../../../types";
import { utils } from "@govtechsg/open-attestation";

export const getRevokingJobs = async (documents: any[], nonce: number): Promise<RevokingJob[]> => {
  return Promise.all(
    documents.map(async (document) => {
      let contractAddress = "";
      try {
        contractAddress = utils.getIssuerAddress(document)[0];
      } finally {
        if (!contractAddress) {
          if (utils.isWrappedV2Document(document)) {
            const unwrappedDocument = utils.getData(document);
            const issuer = unwrappedDocument.issuers[0];
            contractAddress = issuer.revocation?.location || "";
          } else if (utils.isWrappedV3Document(document)) {
            contractAddress = document.openAttestationMetadata.proof.revocation?.location || "";
          }
        }
      }

      const targetHash = utils.getTargetHash(document);
      return {
        nonce,
        contractAddress,
        targetHash,
        documents,
      };
    })
  );
};
