import { Wallet } from "ethers";
import { ConnectedSigner } from "../../types";
import { connect } from "@tradetrust-tt/document-store";
import { DocumentStore } from "@tradetrust-tt/document-store";
import { TradeTrustToken, TradeTrustToken__factory } from "@tradetrust-tt/token-registry/contracts";

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
  const documentStore = await connect(contractAddress, account);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return documentStore;
};

export const getConnectedTokenRegistry = async (
  account: Wallet | ConnectedSigner,
  contractAddress: string
): Promise<TradeTrustToken> => {
  const connectedRegistry = TradeTrustToken__factory.connect(contractAddress, account);
  return connectedRegistry;
};
