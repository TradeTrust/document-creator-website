import { Wallet } from "ethers";
import { RevokingJob } from "../../types";
import { assertAddressIsSmartContract, getConnectedDocumentStore } from "../publishing";

export const revokeDocumentJob = async (job: RevokingJob, wallet: Wallet): Promise<string> => {
  const { contractAddress, targetHash, nonce } = job;
  await assertAddressIsSmartContract(contractAddress, wallet);
  const documentStore = await getConnectedDocumentStore(wallet, contractAddress);
  const receipt = await documentStore.revoke(`0x${targetHash}`, { nonce });
  const tx = await receipt.wait();
  if (!tx.transactionHash) throw new Error(`Tx hash not available: ${JSON.stringify(tx)}`);
  return tx.transactionHash;
};
