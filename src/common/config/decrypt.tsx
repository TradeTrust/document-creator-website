import { Wallet, getDefaultProvider, providers } from "ethers";
import { ConfigFile } from "../../types";
import { RelayProvider } from "@opengsn/gsn/dist/src/relayclient/RelayProvider";
import { getGSNRelayConfig, getHttpProviderUri } from "../../config";
import { configureGSN } from "@opengsn/gsn/dist/src/relayclient/GSNConfigurator";
import Web3HttpProvider from "web3-providers-http";

interface DecryptedSigner {
  gsnRelayProvider: providers.JsonRpcSigner;
  wallet: Wallet;
}

export const decryptConfig = async (
  config: ConfigFile,
  password: string,
  progressCallback: (progress: number) => void
): Promise<DecryptedSigner> => {
  // Get configured gsn provider based on network
  const gsnProvider = await getGsnRelayProvider(config);

  // Decrypt wallet to use wallet account as signer
  const account = await decryptWallet(config, password, progressCallback);
  gsnProvider.addAccount({
    address: account.address,
    privateKey: Buffer.from(account.privateKey.replace("0x", ""), "hex"),
  });
  const from = account.address;

  // GsnProvider is now an rpc provider with GSN support. make it an ethers provider:
  const etherProvider = new providers.Web3Provider(gsnProvider);
  return { gsnRelayProvider: etherProvider.getSigner(from), wallet: account };
};

export const getGsnRelayProvider = async (config: ConfigFile): Promise<RelayProvider> => {
  // Get network and chainId
  const origProvider = new Web3HttpProvider(getHttpProviderUri(config.network));
  const defaultProvider = new providers.Web3Provider(origProvider);
  const chainId = (await defaultProvider.getNetwork())?.chainId;

  /* Configure GsnProvider to use correct relay and contracts
  Note: unsure why stakeManagerAddress not needed, according to type */
  const gsnRelayConfig = getGSNRelayConfig(config.network);
  const gsnConfig = configureGSN({
    relayHubAddress: gsnRelayConfig.relayHub,
    paymasterAddress: gsnRelayConfig.paymaster,
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
  const gsnProvider = new RelayProvider(origProvider, gsnConfig);
  return gsnProvider;
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
