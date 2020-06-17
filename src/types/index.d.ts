import { Wallet } from "ethers";

export interface Form {
  name: string;
  type: "TRANSFERABLE_RECORD" | "VERIFIABLE_DOCUMENT";
  defaults: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  schema: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  attachments?: Attachments;
}

export interface ConfigFile {
  wallet: string;
  forms: Form[];
}

export interface Config {
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
  // Can set the file name here as well
  // fileName: string;
  data: FormData;
  templateIndex: number;
}
