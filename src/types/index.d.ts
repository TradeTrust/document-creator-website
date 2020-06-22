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
  schema: any;
  uiSchema: any;
  idSchema: any;
  formData: any;
  edit: boolean;
  errors: any;
  errorSchema: any;
}

export interface FormEntry {
  fileName: string;
  data: FormData;
  templateIndex: number;
}
