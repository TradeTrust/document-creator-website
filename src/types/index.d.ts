import { Wallet } from "ethers";

export interface ConfigFile {
  wallet: string;
}

export interface Config {
  wallet: Wallet;
}
