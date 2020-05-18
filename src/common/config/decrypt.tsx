import { Wallet } from "ethers";
import { ConfigFile } from "../../types";

export const decryptWallet = (wallet: ConfigFile["wallet"], password: string): Promise<Wallet> =>
  Wallet.fromEncryptedJson(wallet, password);
