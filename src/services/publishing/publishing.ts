import { DocumentStoreFactory, GsnCapableDocumentStoreFactory } from "@govtechsg/document-store";
import { DocumentStore } from "@govtechsg/document-store/src/contracts/DocumentStore";
import { signDocument, SUPPORTED_SIGNING_ALGORITHM } from "@govtechsg/open-attestation";
import { TitleEscrowCreatorFactory, TradeTrustERC721Factory } from "@govtechsg/token-registry";
import { TitleEscrowCreator } from "@govtechsg/token-registry/types/TitleEscrowCreator";
import { providers, Signer, Wallet } from "ethers";
import { getGsnRelaySigner } from "../../common/config/decrypt";
import { PublishingJob, WrappedDocument } from "../../types";
import { supportsInterface } from "./utils";

const assertAddressIsSmartContract = async (address: string, wallet: Wallet): Promise<void> => {
  const code = await wallet.provider.getCode(address);
  if (code === "0x") throw new Error("Address is not a smart contract");
};

const getConnectedDocumentStore = async (
  wallet: Wallet,
  contractAddress: string
): Promise<DocumentStore> => {
  const documentStore = GsnCapableDocumentStoreFactory.connect(contractAddress, wallet);
  // Determine if contract is gsn capable
  const isGsnCapable = await supportsInterface(documentStore, "0xa5a23640");
  if (!isGsnCapable) return DocumentStoreFactory.connect(contractAddress, wallet);
  // Get paymaster address and the relevant gsnProvider
  const paymasterAddress = await documentStore.getPaymaster();
  const signer = await getGsnRelaySigner(wallet, paymasterAddress);
  const gsnDocumentStore = GsnCapableDocumentStoreFactory.connect(contractAddress, signer);
  return gsnDocumentStore;
};

export const publishVerifiableDocumentJob = async (
  job: PublishingJob,
  wallet: Wallet
): Promise<string> => {
  const { contractAddress, merkleRoot, nonce } = job;
  await assertAddressIsSmartContract(contractAddress, wallet);
  const documentStore = await getConnectedDocumentStore(wallet, contractAddress);
  const receipt = await documentStore.issue(`0x${merkleRoot}`, { nonce });
  const tx = await receipt.wait();
  if (!tx.transactionHash) throw new Error(`Tx hash not available: ${JSON.stringify(tx)}`);
  return tx.transactionHash;
};

export const publishDnsDidVerifiableDocumentJob = async (
  job: PublishingJob,
  wallet: Wallet
): Promise<WrappedDocument[]> => {
  const signedDocumentsList: WrappedDocument[] = [];
  const signingDocuments = job.documents.map(async (doc) => {
    try {
      const signedDocument = await signDocument(
        doc.wrappedDocument,
        SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
        {
          public: doc.rawDocument.issuers[0].identityProof.key,
          private: wallet.privateKey,
        }
      );
      signedDocumentsList.push(signedDocument);
    } catch (e) {
      throw new Error(`Error signing document: ${doc.rawDocument.issuers[0].id}`);
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

export const getTitleEscrowCreator = async (wallet: Signer): Promise<TitleEscrowCreator> => {
  const provider = wallet.provider as providers.Provider;
  const { name } = await provider.getNetwork();
  const creatorContractAddress = CREATOR_CONTRACTS[name];
  if (!creatorContractAddress)
    throw new Error(`Title escrow contract creator is not declared for ${name} network`);
  return TitleEscrowCreatorFactory.connect(creatorContractAddress, wallet);
};

export const publishTransferableRecordJob = async (
  job: PublishingJob,
  wallet: Wallet
): Promise<string> => {
  const { payload, contractAddress, nonce, merkleRoot } = job;
  if (!payload.ownership) throw new Error("Ownership data is not provided");
  const { beneficiaryAddress, holderAddress } = payload.ownership;
  const titleEscrowCreatorContract = await getTitleEscrowCreator(wallet);

  // Impossible to do contract address forecasting since the nonce at the title escrow creator
  // is non-deterministic at time of calling. May consider create2 deployment in the future.
  const escrowDeploymentReceipt = await titleEscrowCreatorContract.deployNewTitleEscrow(
    contractAddress,
    beneficiaryAddress,
    holderAddress,
    { nonce }
  );
  const escrowDeploymentTx = await escrowDeploymentReceipt.wait();
  const deployedTitleEscrowArgs = escrowDeploymentTx.events?.find(
    (event) => event.event === "TitleEscrowDeployed"
  )?.args;
  if (!deployedTitleEscrowArgs || !deployedTitleEscrowArgs[0])
    throw new Error(
      `Address for deployed title escrow cannot be found. Tx: ${JSON.stringify(escrowDeploymentTx)}`
    );
  const deployedTitleEscrowAddress = deployedTitleEscrowArgs[0];
  const tokenRegistryContract = TradeTrustERC721Factory.connect(contractAddress, wallet);

  // Using explicit safeMint function which exist but not typed by typechain due to
  // overloads
  const mintingReceipt = await tokenRegistryContract["safeMint(address,uint256)"](
    deployedTitleEscrowAddress,
    `0x${merkleRoot}`,
    {
      nonce: nonce + 1,
    }
  );
  const mintingTx = await mintingReceipt.wait();
  if (!mintingTx.transactionHash)
    throw new Error(`Tx hash not available: ${JSON.stringify(mintingTx)}`);
  return mintingTx.transactionHash;
};

export const publishJob = async (job: PublishingJob, wallet: Wallet): Promise<string> => {
  if (job.type === "VERIFIABLE_DOCUMENT") return publishVerifiableDocumentJob(job, wallet);
  if (job.type === "TRANSFERABLE_RECORD") return publishTransferableRecordJob(job, wallet);
  throw new Error("Job type is not supported");
};

export const publishDnsDidJob = async (
  job: PublishingJob,
  wallet: Wallet
): Promise<WrappedDocument[]> => {
  if (job.type === "VERIFIABLE_DOCUMENT") return publishDnsDidVerifiableDocumentJob(job, wallet);
  throw new Error("Job type is not supported");
};
