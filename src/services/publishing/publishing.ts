import {
  getData,
  signDocument,
  SignedWrappedDocument,
  SUPPORTED_SIGNING_ALGORITHM,
  TTv4,
  v2,
} from "@tradetrust-tt/tradetrust";
import { TradeTrustToken__factory } from "@tradetrust-tt/token-registry/contracts";
import { Signer, Wallet } from "ethers";
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

export const publishIdvcVerifiableDocumentJob = async (
  wrappedDocuments: TTv4.WrappedDocument[],
  signers: Signer
): Promise<TTv4.WrappedDocument[]> => {
  const signedDocumentsList: SignedWrappedDocument<TTv4.TradeTrustDocument>[] = [];
  const signingDocuments = wrappedDocuments.map(async (doc) => {
    try {
      const signedDocument = await signDocument(doc, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, signers);
      signedDocumentsList.push(signedDocument);
    } catch (e) {
      throw new Error(`Error signing document: ${doc.issuer.id}`);
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
  const mintingReceipt = await tokenRegistryContract.mint(beneficiaryAddress, holderAddress, `0x${merkleRoot}`, {
    ...suggestedGasPrice,
  });
  const mintingTx = await mintingReceipt.wait();
  if (!mintingTx.transactionHash) throw new Error(`Tx hash not available: ${JSON.stringify(mintingTx)}`);
  return mintingTx.transactionHash;
};

export const publishJob = async (job: PublishingJob, wallet: Wallet | ConnectedSigner): Promise<string> => {
  if (job.type === "VERIFIABLE_DOCUMENT") return publishVerifiableDocumentJob(job, wallet);
  if (job.type === "TRANSFERABLE_RECORD") return publishTransferableRecordJob(job, wallet);
  throw new Error("Job type is not supported");
};
