export type PreCheckErrorTypes = "dns" | "ownership" | "config";
export interface PreCheckError {
  type: PreCheckErrorTypes;
  message: string;
}

export type PreCheckStatus = PreCheckError | "VALID";
