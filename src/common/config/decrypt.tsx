import { Wallet, getDefaultProvider } from "ethers";
import { ConfigFile } from "../../types";

export const decryptWallet = async (config: ConfigFile, password: string): Promise<Wallet> => {
  const decryptedWallet = await Wallet.fromEncryptedJson(config.wallet, password);
  const connectedWallet = await decryptedWallet.connect(getDefaultProvider(config.network));
  return connectedWallet;
};
