import { v2 } from "@govtechsg/open-attestation";
import { DocumentStorage, Network, WalletOptions } from "../../../types";
export interface Forms {
  version: "v2" | "v3" | "v2-did" | "v3-did"; // version property is used to differentiate the placement of the credential based on their respective schema
  forms: any;
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

export interface EmptyConfig {
  network: string;
  wallet: string | WalletOptions;
  forms: [];
  documentStorage?: DocumentStorage;
}

export interface GenerateConfigFileProps {
  configFile: EmptyConfig;
  formsList: Forms[];
  credential: Credential | DidCredential;
  directory: string;
  validationBypass?: boolean; // validationBypass is used for local configuration to create error configuration used for testing purposes
}
