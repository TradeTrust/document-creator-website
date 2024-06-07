import { ProviderDetails, utils } from "@tradetrust-tt/tt-verify";
import { getChainInfoFromNetworkName } from "../../../common/utils";
import { ChainInfo } from "../../../constants/chainInfo";
import { ConfigFile, ConnectedSigner } from "../../../types";
import { Wallet, ethers, providers } from "ethers";
import { DEMO_PRIVATE_KEY } from "../../../constants/demo-config";

export const loadDemoWallet = async (config: ConfigFile): Promise<Wallet | ConnectedSigner> => {
  const chainId = getChainInfoFromNetworkName(config.network).chainId;
  const rpcUrl = ChainInfo[chainId].rpcUrl;
  const opts: ProviderDetails = rpcUrl
    ? { url: rpcUrl }
    : {
        network: config.network,
        providerType: "infura",
      };

  const provider = config.network === "local" ? new providers.JsonRpcProvider() : utils.generateProvider(opts);
  const wallet = new ethers.Wallet(DEMO_PRIVATE_KEY);
  return wallet.connect(provider);
};
