import { v2 } from "@govtechsg/open-attestation";
import { DocumentStorage, Network, WalletOptions } from "../../../types";

export interface Forms {
  version: "v2" | "v3" | "v2-did" | "v3-did";
  forms: any;
}

export interface EmptyConfig {
  network: string;
  wallet: any;
  forms: [];
  documentStorage?: any;
}

export interface Credential {
  network: Network;
  wallet: string | WalletOptions;
  identityProof: string;
  tokenRegistry: string;
  documentStore: string;
  documentStorage?: DocumentStorage;
}

export interface DidCredential {
  network: Network;
  wallet: string | WalletOptions;
  identityProof: string;
  didAddress: string;
  revocation: v2.Revocation;
  documentStorage?: DocumentStorage;
}
