import { Wallet } from "ethers";
import { ConfigFile } from "../../../types";

export const decryptWallet = (wallet: ConfigFile["wallet"], password: string) => Wallet.fromEncryptedJson(wallet, password);
