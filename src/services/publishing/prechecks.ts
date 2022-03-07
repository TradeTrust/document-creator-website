import { DocumentStoreFactory, GsnCapableDocumentStoreFactory } from "@govtechsg/document-store";
import { DocumentStore } from "@govtechsg/document-store/src/contracts/DocumentStore";
import {
  getData,
  signDocument,
  SignedWrappedDocument,
  SUPPORTED_SIGNING_ALGORITHM,
  v2,
} from "@govtechsg/open-attestation";
import { TitleEscrowCreatorFactory, TradeTrustErc721Factory } from "@govtechsg/token-registry";
import { TitleEscrowCreator } from "@govtechsg/token-registry/types/TitleEscrowCreator";
import { providers, Signer, Wallet } from "ethers";
import { getGsnRelaySigner } from "../../common/config/decrypt";
import { ConnectedSigner, PublishingJob } from "../../types";
import { supportsInterface } from "./utils";
const axios = require('axios');

export const assertAddressIsSmartContract = async (
  address: string,
  account: Wallet | ConnectedSigner
): Promise<void> => {
  const code = await account.provider.getCode(address);
  if (code === "0x") throw new Error("Address is not a smart contract");
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
      return false;
    await assertAddressIsSmartContract(contractAddress, account);
    const documentStore = await getConnectedDocumentStore(account, contractAddress);
    return documentStore.isOwner();
};

// 
/*

*/
export const checkTransferableRecordOwnership = async (contractAddress: string, signer: Signer): Promise<boolean> => {
    const userWalletAddress = await signer.getAddress();
    const chainId = await signer.getChainId();
    var network = "";
    if(chainId == 1){
        network = "";
    }else if(chainId == 3){
        network = "-ropsten";
    }else if(chainId == 4){
        network = "-rinkeby";
    }else if(chainId == 5){
        network = "-goerli";
    }else if(chainId == 42){
        network = "-kovan";
    }

    const response = await axios.get(`https://api${network}.etherscan.io/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc`);
    return response.data?.result[0]?.from == userWalletAddress;
};

export const checkOwnership = async (type: string, contractAddress: string, wallet: Wallet | ConnectedSigner): Promise<boolean> => {
    // if (type === "VERIFIABLE_DOCUMENT") return checkVerifiableDocumentOwnership(contractAddress, wallet);
    // if (type === "TRANSFERABLE_RECORD") return checkTransferableRecordOwnership(contractAddress, wallet);
    return checkTransferableRecordOwnership(contractAddress, wallet);
    throw new Error("Job type is not supported");
  };
