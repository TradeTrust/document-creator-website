import { ProviderDetails, utils } from "@tradetrust-tt/tt-verify";
import { providers, Wallet } from "ethers";
import { AwsKmsSigner } from "@govtechsg/ethers-aws-kms-signer";
import { ChainInfo } from "../../constants/chainInfo";
import { AwsKmwSignerOption, ConfigFile, ConnectedSigner } from "../../types";
import { getChainInfoFromNetworkName, isWalletOption } from "../utils";

export const decryptWalletOrSigner = async (
  config: ConfigFile,
  password: string,
  progressCallback: (progress: number) => void
): Promise<Wallet | ConnectedSigner> => {
  const chainId = getChainInfoFromNetworkName(config.network).chainId;
  const rpcUrl = ChainInfo[chainId].rpcUrl;
  const opts: ProviderDetails = rpcUrl
    ? { url: rpcUrl }
    : {
        network: config.network,
        providerType: "infura",
      };

  const provider = config.network === "local" ? new providers.JsonRpcProvider() : utils.generateProvider(opts);

  if (isWalletOption(config.wallet)) {
    // For backward compatibility when the wallet is still string
    return decryptEncryptedJson(config.wallet, password, progressCallback, provider);
  } else {
    switch (config.wallet.type) {
      case "ENCRYPTED_JSON":
        return decryptEncryptedJson(config.wallet.encryptedJson, password, progressCallback, provider);
      case "AWS_KMS":
        return decryptAwsKms(config.wallet, password, provider);
      default:
        throw new Error("Wallet type not supported.");
    }
  }
};

const decryptAwsKms = async (wallet: AwsKmwSignerOption, password: string, provider: providers.Provider) => {
  const kmsCredentials = {
    accessKeyId: wallet.accessKeyId, // credentials for your IAM user with KMS access
    secretAccessKey: password, // credentials for your IAM user with KMS access
    region: wallet.region,
    keyId: wallet.kmsKeyId,
  };

  const signer = new AwsKmsSigner(kmsCredentials).connect(provider);
  try {
    const connectedSigner = signer as unknown as ConnectedSigner;
    if (await connectedSigner.getAddress()) {
      return connectedSigner;
    }
    throw new Error("Unable to attach the provider to the kms signer");
  } catch (e) {
    throw new Error("Unable to attach the provider to the kms signer");
  }
};

const decryptEncryptedJson = async (
  encryptedJson: string,
  password: string,
  progressCallback: (progress: number) => void,
  provider: providers.Provider
) => {
  return (await Wallet.fromEncryptedJson(encryptedJson, password, progressCallback)).connect(provider);
};
