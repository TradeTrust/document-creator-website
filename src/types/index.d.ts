import { Wallet } from "ethers";

export interface Form {
  name: string;
  type: string;
}

export interface ConfigFile {
  wallet: string;
  forms: Form[];
}

export interface Config {
  wallet: Wallet;
  forms: Form[];
}
