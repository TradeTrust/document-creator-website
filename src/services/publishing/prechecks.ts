import { DocumentStoreFactory, GsnCapableDocumentStoreFactory } from "@govtechsg/document-store";
import { DocumentStore } from "@govtechsg/document-store/src/contracts/DocumentStore";
import { OpenAttestationDocument, utils } from "@govtechsg/open-attestation";
import { Signer, Wallet } from "ethers";
import { getGsnRelaySigner } from "../../common/config/decrypt";
import { ConnectedSigner, NetworkObject } from "../../types";
import { supportsInterface } from "./utils";
import { checkCreationAddress } from "./utils/explorer";

export const assertAddressIsSmartContract = async (
  address: string,
  account: Wallet | ConnectedSigner
): Promise<boolean> => {
  const code = await account.provider.getCode(address);
  if (code === "0x") return false;
  return true;
};

export const getConnectedDocumentStore = async (
  account: Wallet | ConnectedSigner,
  contractAddress: string
): Promise<DocumentStore> => {
  const documentStore = GsnCapableDocumentStoreFactory.connect(contractAddress, account);
  // Determine if contract is gsn capable
  const isGsnCapable = await supportsInterface(documentStore, "0xa5a23640");
  if (!isGsnCapable) return DocumentStoreFactory.connect(contractAddress, account);
  // Get paymaster address and the relevant gsnProvider
  const paymasterAddress = await documentStore.getPaymaster();
  const gsnRelaySigner = await getGsnRelaySigner(account, paymasterAddress);
  const gsnDocumentStore = GsnCapableDocumentStoreFactory.connect(contractAddress, gsnRelaySigner);
  return gsnDocumentStore;
};

export const checkVerifiableDocumentOwnership = async (
  contractAddress: string,
  account: Wallet | ConnectedSigner
): Promise<boolean> => {
  if (!(await assertAddressIsSmartContract(contractAddress, account))) {
    return false;
  }
  const documentStore = await getConnectedDocumentStore(account, contractAddress);
  return (await documentStore.owner()) == (await account.getAddress());
};

export const checkTransferableRecordOwnership = async (contractAddress: string, signer: Signer): Promise<boolean> => {
  const userWalletAddress = await signer.getAddress();
  const network = await signer.provider?.getNetwork();
  if (network == undefined) {
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
    return isDID == undefined ? false : isDID;
  } else if (utils.isRawV3Document(rawDocument)) {
    return rawDocument.openAttestationMetadata.proof.value.includes("did:ethr:");
  }
  throw new Error(
    "Unsupported document type: Only can retrieve issuer address from OpenAttestation v2 & v3 documents."
  );
};
