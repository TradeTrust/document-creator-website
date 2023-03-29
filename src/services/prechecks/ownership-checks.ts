import { OpenAttestationDocument, utils } from "@govtechsg/open-attestation";
import { TradeTrustToken } from "@govtechsg/token-registry/dist/contracts";
import { Wallet, ethers } from "ethers";
import { ConnectedSigner } from "../../types";
import { getConnectedDocumentStore, checkAddressIsSmartContract, getConnectedTokenRegistry } from "../common";
import { supportsInterface } from "../common/utils";
import { PreCheckError, PreCheckStatus } from "./types";

const defaultError: PreCheckError = {
  type: "ownership",
  message: "",
};

const invalidSmartContract = "Invalid or Unsupported smart contract";
const unownedDocumentStore = "Document Store is not owned by wallet";
const unownedTokenRegistry = "Wallet do not have permission to mint on Token Registry";
const invalidConfigType = "Unsupported Job Type";

const createPreCheckError = (message: string): PreCheckError => {
  return { ...defaultError, message };
};

export const checkVerifiableDocumentOwnership = async (
  contractAddress: string,
  account: Wallet | ConnectedSigner
): Promise<PreCheckStatus> => {
  if (!(await checkAddressIsSmartContract(contractAddress, account))) {
    return createPreCheckError(invalidSmartContract);
  }
  const documentStore = await getConnectedDocumentStore(account, contractAddress);
  const walletAddress = await account.getAddress();
  const issuerRole = ethers.utils.id("ISSUER_ROLE");
  const validIssuer = await documentStore.hasRole(issuerRole, walletAddress);

  if (validIssuer) {
    return "VALID";
  } else {
    return createPreCheckError(unownedDocumentStore);
  }
};

export const checkTransferableRecordOwnership = async (
  contractAddress: string,
  wallet: Wallet | ConnectedSigner
): Promise<PreCheckStatus> => {
  const isSmartContract = await checkAddressIsSmartContract(contractAddress, wallet);
  if (!isSmartContract) return createPreCheckError(invalidSmartContract);
  const connectedRegistry: TradeTrustToken = await getConnectedTokenRegistry(wallet, contractAddress);
  const isTokenRegistry = await supportsInterface(connectedRegistry, "0x95a63a27");
  if (!isTokenRegistry) return createPreCheckError(invalidSmartContract);
  const validOwnership = await transferableRecordsRolesCheck(connectedRegistry, wallet);
  if (validOwnership) return "VALID";
  else return createPreCheckError(unownedTokenRegistry);
};

export const transferableRecordsRolesCheck = async (
  connectedRegistry: TradeTrustToken,
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
): Promise<PreCheckStatus> => {
  if (type === "VERIFIABLE_DOCUMENT") return checkVerifiableDocumentOwnership(contractAddress, wallet);
  if (type === "TRANSFERABLE_RECORD") return checkTransferableRecordOwnership(contractAddress, wallet);
  return { type: "config", message: invalidConfigType };
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
