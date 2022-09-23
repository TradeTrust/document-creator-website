import { OpenAttestationDocument, utils } from "@govtechsg/open-attestation";
import { TradeTrustERC721 } from "@govtechsg/token-registry/dist/contracts";
import { Wallet } from "ethers";
import { ConnectedSigner } from "../../types";
import { getConnectedDocumentStore, checkAddressIsSmartContract, getConnectedTokenRegistry } from "../common";

export const checkVerifiableDocumentOwnership = async (
  contractAddress: string,
  account: Wallet | ConnectedSigner
): Promise<boolean> => {
  if (!(await checkAddressIsSmartContract(contractAddress, account))) {
    return false;
  }
  const documentStore = await getConnectedDocumentStore(account, contractAddress);
  return (await documentStore.owner()) === (await account.getAddress());
};

export const checkTransferableRecordOwnership = async (
  contractAddress: string,
  wallet: Wallet | ConnectedSigner
): Promise<boolean> => {
  if (!(await checkAddressIsSmartContract(contractAddress, wallet))) {
    return false;
  }
  const connectedRegistry: TradeTrustERC721 = await getConnectedTokenRegistry(wallet, contractAddress);
  return await transferableRecordsRolesCheck(connectedRegistry, wallet);
};

export const transferableRecordsRolesCheck = async (
  connectedRegistry: TradeTrustERC721,
  account: Wallet | ConnectedSigner
): Promise<boolean> => {
  const minterRole = await connectedRegistry.MINTER_ROLE();
  const signerAddress = await account.getAddress();
  const isMinter = await connectedRegistry.hasRole(minterRole, signerAddress);
  return isMinter;
};

export const checkContractOwnership = async (
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
