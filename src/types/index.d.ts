import { Wallet } from "ethers";

type Network = "homestead" | "ropsten" | "rinkeby" | "local";
type FormType = "TRANSFERABLE_RECORD" | "VERIFIABLE_DOCUMENT";

// FormTemplate is defined in configuration file
export interface FormTemplate {
  name: string;
  type: FormType;
  defaults: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  schema: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  attachments?: Attachments;
}

export interface DocumentStorage {
  apiKey: string;
  url: string;
}

export interface ConfigFile {
  network: Network;
  wallet: string;
  forms: FormTemplate[];
  documentStorage?: DocumentStorage;
}

export interface Config {
  network: Network;
  wallet: Wallet;
  forms: FormTemplate[];
  documentStorage?: DocumentStorage;
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

// FormData is used by json-schema-forms internally to track state of a single form
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

// FormEntry is used to store a form's inputs (from FromData) & metadata
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

export interface FailedJobErrors {
  documents: WrappedDocument[];
  error: Error;
}

export interface ActionsUrlObject {
  links: { self: { href: string } };
}

export interface QueueNumberResponse {
  id: string;
  key: string;
}
