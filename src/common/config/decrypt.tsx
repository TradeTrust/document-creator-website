import { Wallet, getDefaultProvider, providers } from "ethers";
import { ConfigFile } from "../../types";
import { RelayProvider, configureGSN } from "@opengsn/gsn";
import { getGSNRelayConfig, getHttpProviderUri } from "../../config";
import Web3HttpProvider from "web3-providers-http";

export const getGsnRelaySigner = async (
  account: Wallet,
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
  const gsnConfig = configureGSN({
    relayHubAddress: gsnRelayConfig.relayHub,
    paymasterAddress,
    forwarderAddress: gsnRelayConfig.forwarder,
    gasPriceFactorPercent: 70,
    methodSuffix: "_v4",
    jsonStringifyRequest: true,
    chainId,
    relayLookupWindowBlocks: 1e5,
  });

  /* Wrap GsnProvider with a eth node provider
  However, Gsn does not support ethers provider vice versa hence we will need to use metamask provider
  Refer to:
  https://github.com/ethers-io/ethers.js/issues/636
  https://github.com/ethers-io/ethers.js/issues/1088
  https://github.com/ethers-io/ethers.js/issues/956
  https://github.com/ethers-io/ethers.js/pull/836
  Using Web3HttpProvider from web3 to solve problem for now
  */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gsnProvider = new RelayProvider(origProvider, gsnConfig) as any;

  // Decrypt wallet to use wallet account as signer
  gsnProvider.addAccount({
    address: account.address,
    privateKey: Buffer.from(account.privateKey.replace("0x", ""), "hex"),
  });
  const from = account.address;

  // GsnProvider is now an rpc provider with GSN support. make it an ethers provider:
  const etherProvider = new providers.Web3Provider(gsnProvider);

  return etherProvider.getSigner(from);
};

export const decryptWallet = async (
  config: ConfigFile,
  password: string,
  progressCallback: (progress: number) => void
): Promise<Wallet> => {
  const decryptedWallet = await Wallet.fromEncryptedJson(config.wallet, password, progressCallback);
  if (config.network === "local") {
    const provider = new providers.JsonRpcProvider();
    return decryptedWallet.connect(provider);
  } else {
    const connectedWallet = await decryptedWallet.connect(getDefaultProvider(config.network));
    return connectedWallet;
  }
};
