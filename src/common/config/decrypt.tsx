import { Wallet, getDefaultProvider, providers } from "ethers";
import { AwsKmwSignerOption, ConfigFile, ConnectedSigner } from "../../types";
import { RelayProvider } from "@opengsn/gsn";
import { getGSNRelayConfig, getHttpProviderUri } from "../../config";
import Web3HttpProvider from "web3-providers-http";
import { isWalletOption } from "../utils";
import { AwsKmsSigner } from "ethers-aws-kms-signer";

export const getGsnRelaySigner = async (
  account: Wallet | ConnectedSigner,
  paymasterAddress: string
): Promise<providers.JsonRpcSigner> => {
  // Get network and chainId
  const networkInformation = await account.provider.getNetwork();
  const network = networkInformation?.name;
  const chainId = networkInformation?.chainId;

  const origProvider = new Web3HttpProvider(getHttpProviderUri(network));

  /* Configure GsnProvider to use correct relay and contracts
  Note: unsure why stakeManagerAddress not needed, according to type */
  const gsnRelayConfig = getGSNRelayConfig(network);
  const gsnConfig = {
    relayHubAddress: gsnRelayConfig.relayHub,
    paymasterAddress,
    forwarderAddress: gsnRelayConfig.forwarder,
    gasPriceFactorPercent: 70,
    methodSuffix: "_v4",
    jsonStringifyRequest: true,
    chainId,
    relayLookupWindowBlocks: 1e5,
  };

  /* Wrap GsnProvider with a eth node provider
  However, Gsn does not support ethers provider vice versa hence we will need to use metamask provider
  Refer to:
  https://github.com/ethers-io/ethers.js/issues/636
  https://github.com/ethers-io/ethers.js/issues/1088
  https://github.com/ethers-io/ethers.js/issues/956
  https://github.com/ethers-io/ethers.js/pull/836
  Using Web3HttpProvider from web3 to solve problem for now
  */

  const gsnProvider = RelayProvider.newProvider({
    provider: origProvider,
    config: gsnConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any; // the types are a bit fucked up for now; not worth fixing until opengsn stabilises
  await gsnProvider.init();

  // Decrypt wallet to use wallet account as signer
  gsnProvider.addAccount(account.privateKey);
  const from = await account.getAddress();

  // GsnProvider is now an rpc provider with GSN support. make it an ethers provider:
  const etherProvider = new providers.Web3Provider(gsnProvider);

  return etherProvider.getSigner(from);
};

export const decryptWalletOrSigner = async (
  config: ConfigFile,
  password: string,
  progressCallback: (progress: number) => void
): Promise<Wallet | ConnectedSigner> => {
  const provider = config.network === "local" ? new providers.JsonRpcProvider() : getDefaultProvider(config.network);
  if (isWalletOption(config.wallet)) {
    const decryptedWallet = await Wallet.fromEncryptedJson(config.wallet, password, progressCallback);
    const connectedWallet = await decryptedWallet.connect(provider);
    return connectedWallet;
  } else {
    switch (config.wallet.type) {
      case "ENCRYPTED_JSON":
        return (await Wallet.fromEncryptedJson(config.wallet.encryptedJson, password, progressCallback)).connect(
          provider
        );
      case "AWS_KMS":
        return decryptAwsKms(config.wallet, password, provider);
      default:
        throw new Error("Wallet type not supported.");
    }
  }
};

const decryptAwsKms = async (wallet: AwsKmwSignerOption, password: string, provider: providers.BaseProvider) => {
  const kmsCredentials = {
    accessKeyId: wallet.accessKeyId, // credentials for your IAM user with KMS access
    secretAccessKey: password, // credentials for your IAM user with KMS access
    region: wallet.region,
    keyId: wallet.kmsKeyId,
  };

  const signer = new AwsKmsSigner(kmsCredentials).connect(provider);
  try {
    const connectedSigner = signer as ConnectedSigner;
    if (await connectedSigner.getAddress()) {
      return connectedSigner;
    }
    throw new Error("Unable to attach the provider to the kms signer");
  } catch (e) {
    throw new Error("Unable to attach the provider to the kms signer");
  }
};
