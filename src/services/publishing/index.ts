import { PublishingJob } from "../../types";
import { Wallet } from "ethers";
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { DocumentStore } from "@govtechsg/document-store/src/contracts/DocumentStore";

const assertAddressIsSmartContract = async (address: string, wallet: Wallet): Promise<void> => {
  const code = await wallet.provider.getCode(address);
  if (code === "0x") throw new Error("Address is not a smart contract");
};

export const publishVerifiableDocumentJob = async (
  job: PublishingJob,
  wallet: Wallet
): Promise<string> => {
  const { contractAddress, merkleRoot, nonce } = job;
  await assertAddressIsSmartContract(contractAddress, wallet);
  const documentStore: DocumentStore = DocumentStoreFactory.connect(contractAddress, wallet);
  const receipt = await documentStore.issue(`0x${merkleRoot}`, { nonce });
  const tx = await receipt.wait();
  return tx.transactionHash;
};

export const publishJob = async (job: PublishingJob, wallet: Wallet): Promise<string> => {
  if (job.type === "VERIFIABLE_DOCUMENT") return publishVerifiableDocumentJob(job, wallet);
  throw new Error("Job type is not supported");
};
