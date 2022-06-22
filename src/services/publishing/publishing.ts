import {
  getData,
  signDocument,
  SignedWrappedDocument,
  SUPPORTED_SIGNING_ALGORITHM,
  v2,
} from "@govtechsg/open-attestation";
import { TradeTrustERC721 } from "@govtechsg/token-registry";
import { TitleEscrowCreatorFactory } from "@govtechsg/token-registry-v2";
import { TitleEscrowCreator } from "@govtechsg/token-registry-v2/dist/ts/contracts";
import { providers, Signer, Wallet } from "ethers";
import { ConnectedSigner, PublishingJob } from "../../types";
import {
  assertAddressIsSmartContract,
  getConnectedDocumentStore,
  getConnectedTokenRegistry,
  TradeTrustVersion,
} from "../common";
import { TradeTrustERC721 as V2TradeTrustERC721 } from "@govtechsg/token-registry-v2/dist/ts/contracts";

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

export const getV2TitleEscrowCreator = async (wallet: Signer): Promise<TitleEscrowCreator> => {
  const provider = wallet.provider as providers.Provider;
  const { name } = await provider.getNetwork();
  const creatorContractAddress = CREATOR_CONTRACTS[name];
  if (!creatorContractAddress) throw new Error(`Title escrow contract creator is not declared for ${name} network`);
  return TitleEscrowCreatorFactory.connect(creatorContractAddress, wallet);
};

export const publishTransferableRecordJobv2 = async (
  job: PublishingJob,
  signer: Signer,
  tokenRegistryInstance: V2TradeTrustERC721
): Promise<string> => {
  const { payload, contractAddress, nonce, merkleRoot } = job;
  if (!payload.ownership) throw new Error("Ownership data is not provided");
  const { beneficiaryAddress, holderAddress } = payload.ownership;
  const titleEscrowCreatorContract = await getV2TitleEscrowCreator(signer);

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
    throw new Error(`Address for deployed title escrow cannot be found. Tx: ${JSON.stringify(escrowDeploymentTx)}`);
  const deployedTitleEscrowAddress = deployedTitleEscrowArgs[0];

  // Using explicit safeMint function which exist but not typed by typechain due to
  // overloads
  const mintingReceipt = await tokenRegistryInstance["safeMint(address,uint256)"](
    deployedTitleEscrowAddress,
    `0x${merkleRoot}`,
    {
      nonce: nonce + 1,
    }
  );
  const mintingTx = await mintingReceipt.wait();
  if (!mintingTx.transactionHash) throw new Error(`Tx hash not available: ${JSON.stringify(mintingTx)}`);
  return mintingTx.transactionHash;
};

export const publishTransferableRecordJobv3 = async (
  job: PublishingJob,
  tokenRegistryInstance: TradeTrustERC721
): Promise<string> => {
  const { payload, merkleRoot } = job;
  if (!payload.ownership) throw new Error("Ownership data is not provided");
  const { beneficiaryAddress, holderAddress } = payload.ownership;
  const mintingReceipt = await tokenRegistryInstance.mintTitle(beneficiaryAddress, holderAddress, `0x${merkleRoot}`);
  const mintingTx = await mintingReceipt.wait();
  if (!mintingTx.transactionHash) throw new Error(`Tx hash not available: ${JSON.stringify(mintingTx)}`);
  return mintingTx.transactionHash;
};

export const publishTransferableRecordJob = async (
  job: PublishingJob,
  signer: Wallet | ConnectedSigner
): Promise<string> => {
  const { contractAddress } = job;
  await assertAddressIsSmartContract(contractAddress, signer);
  const { tokenRegistryInstance, tokenRegistryVersion } = await getConnectedTokenRegistry(signer, contractAddress);
  if (tokenRegistryVersion === TradeTrustVersion.V3) {
    const tokenRegistryInstanceV3 = tokenRegistryInstance as TradeTrustERC721;
    return publishTransferableRecordJobv3(job, tokenRegistryInstanceV3);
  } else if (tokenRegistryVersion === TradeTrustVersion.V2) {
    const tokenRegistryInstanceV2 = tokenRegistryInstance as V2TradeTrustERC721;
    return publishTransferableRecordJobv2(job, signer, tokenRegistryInstanceV2);
  } else {
    throw new Error("Unsupported TradeTrust Token Registry Version");
  }
};

export const publishJob = async (job: PublishingJob, wallet: Wallet | ConnectedSigner): Promise<string> => {
  if (job.type === "VERIFIABLE_DOCUMENT") return publishVerifiableDocumentJob(job, wallet);
  if (job.type === "TRANSFERABLE_RECORD") return publishTransferableRecordJob(job, wallet);
  throw new Error("Job type is not supported");
};
