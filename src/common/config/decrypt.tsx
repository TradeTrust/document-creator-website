import { Wallet, getDefaultProvider, providers } from "ethers";
import { ConfigFile } from "../../types";

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
