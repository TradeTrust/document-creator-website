import {
  getData,
  signDocument,
  SignedWrappedDocument,
  SUPPORTED_SIGNING_ALGORITHM,
  v2,
} from "@tradetrust-tt/tradetrust";
import { TradeTrustToken__factory } from "@tradetrust-tt/token-registry/contracts";
import { constants } from "@tradetrust-tt/token-registry";
import { ethers, Signer, Wallet } from "ethers";
import { ConnectedSigner, PublishingJob } from "../../types";
import { assertAddressIsSmartContract, getConnectedDocumentStore } from "../common";
import { fetchGasPriceSuggestions } from "./gas-price";

export const publishVerifiableDocumentJob = async (
  job: PublishingJob,
  account: Wallet | ConnectedSigner
): Promise<string> => {
  const { contractAddress, merkleRoot } = job;
  await assertAddressIsSmartContract(contractAddress, account);
  const documentStore = await getConnectedDocumentStore(account, contractAddress);
  const suggestedGasPrice = await fetchGasPriceSuggestions(await account.getChainId());
  const receipt = await documentStore.issue(`0x${merkleRoot}`, {
    ...suggestedGasPrice,
  });
  const tx = await receipt.wait();
  if (!tx.transactionHash) throw new Error(`Tx hash not available: ${JSON.stringify(tx)}`);
  return tx.transactionHash;
};

export const publishDnsDidVerifiableDocumentJob = async (
  wrappedDocuments: v2.WrappedDocument[],
  signers: Signer
): Promise<v2.WrappedDocument[]> => {
  const signedDocumentsList: SignedWrappedDocument<v2.OpenAttestationDocument>[] = [];
  const signingDocuments = wrappedDocuments.map(async (doc) => {
    const rawDocumentData = getData(doc);
    try {
      const signedDocument = await signDocument(doc, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, signers);
      signedDocumentsList.push(signedDocument);
    } catch (e) {
      throw new Error(`Error signing document: ${rawDocumentData.issuers[0].id}`);
    }
  });

  await Promise.allSettled(signingDocuments);
  return signedDocumentsList;
};

export const publishTransferableRecordJob = async (job: PublishingJob, signer: Signer): Promise<string> => {
  const { payload, contractAddress, merkleRoot } = job;
  if (!payload.ownership) throw new Error("Ownership data is not provided");
  const { beneficiaryAddress, holderAddress } = payload.ownership;
  const tokenRegistryContract = TradeTrustToken__factory.connect(contractAddress, signer);
  const suggestedGasPrice = await fetchGasPriceSuggestions(await signer.getChainId());

  const mintableSupportInterfaceId = constants.contractInterfaceId.TradeTrustTokenMintable;
  const isV4TT = await tokenRegistryContract.supportsInterface(mintableSupportInterfaceId);

  let mintingReceipt;
  if (isV4TT) {
    mintingReceipt = await tokenRegistryContract.mint(beneficiaryAddress, holderAddress, `0x${merkleRoot}`, {
      ...suggestedGasPrice,
    });
  } else {
    const tokenRegistryV5Contract = new ethers.Contract(
      contractAddress,
      '[{"inputs":[{"internalType":"address","name":"beneficiary","type":"address"},{"internalType":"address","name":"holder","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_remark","type":"bytes"}],"name":"mint","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"}]',
      signer
    );
    mintingReceipt = await tokenRegistryV5Contract.mint(beneficiaryAddress, holderAddress, `0x${merkleRoot}`, "0x", {
      ...suggestedGasPrice,
    });
  }
  const mintingTx = await mintingReceipt.wait();
  if (!mintingTx.transactionHash) throw new Error(`Tx hash not available: ${JSON.stringify(mintingTx)}`);
  return mintingTx.transactionHash;
};

export const publishJob = async (job: PublishingJob, wallet: Wallet | ConnectedSigner): Promise<string> => {
  if (job.type === "VERIFIABLE_DOCUMENT") return publishVerifiableDocumentJob(job, wallet);
  if (job.type === "TRANSFERABLE_RECORD") return publishTransferableRecordJob(job, wallet);
  throw new Error("Job type is not supported");
};
