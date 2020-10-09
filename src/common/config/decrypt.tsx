import { Wallet, ethers, providers } from "ethers";
import { ConfigFile } from "../../types";

export const decryptWallet = async (config: ConfigFile, password: string): Promise<Wallet> => {
  const decryptedWallet = await Wallet.fromEncryptedJson(config.wallet, password);
  if (config.network === "local") {
    const provider = new providers.JsonRpcProvider();
    return decryptedWallet.connect(provider);
  } else {
    const connectedWallet = await decryptedWallet.connect(
      ethers.getDefaultProvider(config.network)
    );
    return connectedWallet;
  }
};
