import { PublishingJob } from "../../types";
import { Wallet } from "ethers";
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { DocumentStore } from "@govtechsg/document-store/src/contracts/DocumentStore";

export const publishVerifiableDocumentJob = async (job: PublishingJob, wallet: Wallet) => {
  const { contractAddress, merkleRoot, nonce } = job;
  const documentStore: DocumentStore = DocumentStoreFactory.connect(contractAddress, wallet);
  const receipt = await documentStore.issue(`0x${merkleRoot}`, { nonce });
  const tx = await receipt.wait();
  return tx.transactionHash;
};

export const publishJob = async (job: PublishingJob, wallet: Wallet) => {
  if (job.type === "VERIFIABLE_DOCUMENT") return publishVerifiableDocumentJob(job, wallet);
  throw new Error("Job type is not supported");
};
