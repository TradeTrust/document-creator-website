import { OpenAttestationDocument, utils } from "@govtechsg/open-attestation";
import { Signer, Wallet } from "ethers";
import { ConnectedSigner, NetworkObject } from "../../types";
import { assertAddressIsSmartContract, getConnectedDocumentStore } from "../publishing";
import { checkCreationAddress } from "./utils";

export const checkVerifiableDocumentOwnership = async (
  contractAddress: string,
  account: Wallet | ConnectedSigner
): Promise<boolean> => {
  try {
    await assertAddressIsSmartContract(contractAddress, account);
  } catch (e) {
    return false;
  }
  const documentStore = await getConnectedDocumentStore(account, contractAddress);
  return (await documentStore.owner()) === (await account.getAddress());
};

export const checkTransferableRecordOwnership = async (contractAddress: string, signer: Signer): Promise<boolean> => {
  const userWalletAddress = await signer.getAddress();
  const network = await signer.provider?.getNetwork();
  if (network === undefined) {
    return false;
  } else {
    const networkObject: NetworkObject = {
      network: {
        chain: network.name,
        chainId: network.chainId.toString(),
      },
    } as NetworkObject;
    return await checkCreationAddress(contractAddress, networkObject, userWalletAddress, false);
  }
};

export const checkOwnership = async (
  type: string,
  contractAddress: string,
  wallet: Wallet | ConnectedSigner
): Promise<boolean> => {
  if (type === "VERIFIABLE_DOCUMENT") return checkVerifiableDocumentOwnership(contractAddress, wallet);
  if (type === "TRANSFERABLE_RECORD") return checkTransferableRecordOwnership(contractAddress, wallet);
  throw new Error("Job type is not supported");
};

export const checkDID = (rawDocument: OpenAttestationDocument): boolean => {
  if (utils.isRawV2Document(rawDocument)) {
    const { issuers } = rawDocument;
    const isDID = issuers[0].id?.includes("did:ethr:");
    return isDID === undefined ? false : isDID;
  } else if (utils.isRawV3Document(rawDocument)) {
    return rawDocument.openAttestationMetadata.proof.value.includes("did:ethr:");
  }
  throw new Error(
    "Unsupported document type: Only can retrieve issuer address from OpenAttestation v2 & v3 documents."
  );
};
