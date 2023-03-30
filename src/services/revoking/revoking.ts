import { Wallet, ethers } from "ethers";
import { RevokingJob, ConnectedSigner } from "../../types";
import { assertAddressIsSmartContract, getConnectedDocumentStore } from "../common";

export const revokeDocumentJob = async (job: RevokingJob, account: Wallet | ConnectedSigner): Promise<string> => {
  const { contractAddress, targetHash } = job;
  await assertAddressIsSmartContract(contractAddress, account);
  const documentStore = await getConnectedDocumentStore(account, contractAddress);
  const walletAddress = await account.getAddress();
  const revokerRole = ethers.utils.id("REVOKER_ROLE");
  const validRevoker = await documentStore.hasRole(revokerRole, walletAddress);

  if (validRevoker) {
    const receipt = await documentStore.revoke(`0x${targetHash}`);
    const tx = await receipt.wait();
    if (!tx.transactionHash) throw new Error(`Tx hash not available: ${JSON.stringify(tx)}`);
    return tx.transactionHash;
  } else {
    throw new Error("Invalid revoker role, please get the admin to revoke this document.");
  }
};
