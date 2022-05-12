import {
  getData,
  signDocument,
  SignedWrappedDocument,
  SUPPORTED_SIGNING_ALGORITHM,
  v2,
} from "@govtechsg/open-attestation";
import { TradeTrustERC721, TradeTrustERC721Factory } from "@govtechsg/token-registry";
// import { TitleEscrowCreator } from "@govtechsg/token-registry/types/TitleEscrowCreator";
import { ContractTransaction, providers, Signer, Wallet } from "ethers";
import { ConnectedSigner, PublishingJob } from "../../types";
import { assertAddressIsSmartContract, getConnectedDocumentStore } from "../common";

export const publishVerifiableDocumentJob = async (
  job: PublishingJob,
  account: Wallet | ConnectedSigner
): Promise<string> => {
  const { contractAddress, merkleRoot, nonce } = job;
  await assertAddressIsSmartContract(contractAddress, account);
  const documentStore = await getConnectedDocumentStore(account, contractAddress);
  const receipt = await documentStore.issue(`0x${merkleRoot}`, { nonce });
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

interface CreatorContract {
  [network: string]: string;
}

const CREATOR_CONTRACTS: CreatorContract = {
  homestead: "0x907A4D491A09D59Bcb5dC38eeb9d121ac47237F1",
  ropsten: "0xB0dE5E22bAc12820b6dbF6f63287B1ec44026c83",
  rinkeby: "0xa51B8dAC076d5aC80507041146AC769542aAe195",
  // unknown is used for local test net, see integration test
  unknown: "0x4Bf7E4777a8D1b6EdD5F2d9b8582e2817F0B0953",
};

export const getConnectedRegistry = async (wallet: Signer): Promise<TradeTrustERC721> => {
  const provider = wallet.provider as providers.Provider;
  const { name } = await provider.getNetwork();
  const creatorContractAddress = CREATOR_CONTRACTS[name];
  if (!creatorContractAddress) throw new Error(`Title escrow contract creator is not declared for ${name} network`);
  return TradeTrustERC721Factory.connect(creatorContractAddress, wallet);
};

export const publishTransferableRecordJob = async (job: PublishingJob, signer: Signer): Promise<string> => {
  const { payload, merkleRoot } = job;
  if (!payload.ownership) throw new Error("Ownership data is not provided");
  const { beneficiaryAddress, holderAddress } = payload.ownership;
  const titleEscrowCreatorContract = await getConnectedRegistry(signer);
  const escrowDeploymentReceipt: ContractTransaction = await titleEscrowCreatorContract.mintTitle(
    beneficiaryAddress,
    holderAddress,
    merkleRoot
  );

  const mintingTx = await escrowDeploymentReceipt.wait();
  if (!mintingTx.transactionHash) throw new Error(`Tx hash not available: ${JSON.stringify(mintingTx)}`);
  return mintingTx.transactionHash;
};

export const publishJob = async (job: PublishingJob, wallet: Wallet | ConnectedSigner): Promise<string> => {
  if (job.type === "VERIFIABLE_DOCUMENT") return publishVerifiableDocumentJob(job, wallet);
  if (job.type === "TRANSFERABLE_RECORD") return publishTransferableRecordJob(job, wallet);
  throw new Error("Job type is not supported");
};
