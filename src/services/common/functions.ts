import { Wallet } from "ethers";
import { ConnectedSigner } from "../../types";
import { DocumentStoreFactory, GsnCapableDocumentStoreFactory } from "@govtechsg/document-store";
import { DocumentStore } from "@govtechsg/document-store/src/contracts/DocumentStore";
import { getGsnRelaySigner } from "../../common/config/decrypt";
import { supportsInterface } from "./utils";
import { TradeTrustERC721, TradeTrustERC721__factory } from "@govtechsg/token-registry/contracts";

export const checkAddressIsSmartContract = async (
  address: string,
  account: Wallet | ConnectedSigner
): Promise<boolean> => {
  const code = await account.provider.getCode(address);
  return code !== "0x";
};
export const assertAddressIsSmartContract = async (
  address: string,
  account: Wallet | ConnectedSigner
): Promise<void> => {
  if (!(await checkAddressIsSmartContract(address, account))) {
    throw new Error("Address is not a smart contract");
  }
};

export const getConnectedDocumentStore = async (
  account: Wallet | ConnectedSigner,
  contractAddress: string
): Promise<DocumentStore> => {
  const documentStore = GsnCapableDocumentStoreFactory.connect(contractAddress, account);
  // Determine if contract is gsn capable
  const isGsnCapable = await supportsInterface(documentStore, "0xa5a23640");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!isGsnCapable) return DocumentStoreFactory.connect(contractAddress, account);
  // Get paymaster address and the relevant gsnProvider
  const paymasterAddress = await documentStore.getPaymaster();
  const gsnRelaySigner = await getGsnRelaySigner(account, paymasterAddress);
  const gsnDocumentStore = GsnCapableDocumentStoreFactory.connect(contractAddress, gsnRelaySigner);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return gsnDocumentStore;
};

export const getConnectedTokenRegistry = async (
  account: Wallet | ConnectedSigner,
  contractAddress: string
): Promise<TradeTrustERC721> => {
  const connectedRegistry = TradeTrustERC721__factory.connect(contractAddress, account);
  return connectedRegistry;
};
