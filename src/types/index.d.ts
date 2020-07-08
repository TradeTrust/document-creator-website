import { Wallet } from "ethers";

type Network = "homestead" | "ropsten" | "rinkeby";
type FormType = "TRANSFERABLE_RECORD" | "VERIFIABLE_DOCUMENT";

export interface Form {
  name: string;
  type: FormType;
  defaults: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  schema: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  attachments?: Attachments;
}

export interface ConfigFile {
  network: Network;
  wallet: string;
  forms: Form[];
}

export interface Config {
  network: Network;
  wallet: Wallet;
  forms: Form[];
}

interface Attachments {
  allow: boolean;
  accept?: string;
}

export interface FileUploadType {
  data: string;
  filename: string;
  type: string;
}
export interface FormData {
  schema?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  uiSchema?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  idSchema?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  formData: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  edit?: boolean;
  errors?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  errorSchema?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Ownership {
  beneficiaryAddress: string;
  holderAddress: string;
}

export interface FormEntry {
  fileName: string;
  data: FormData;
  templateIndex: number;
  ownership: Ownership;
}

export interface RawDocument {
  type: FormType;
  contractAddress: string;
  rawDocument: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  fileName: string;
  payload: { ownership?: Ownership };
}

export interface WrappedDocument extends RawDocument {
  wrappedDocument: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface PublishingJob {
  nonce: number; // For transaction ordering
  type: FormType;
  contractAddress: string;
  documents: WrappedDocument[];
  merkleRoot: string;
  payload: { ownership?: Ownership };
}
