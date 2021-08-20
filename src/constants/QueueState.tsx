export enum QueueState {
  UNINITIALIZED = "UNINITIALIZED",
  INITIALIZED = "INITIALIZED",
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  ERROR = "ERROR",
}

export enum identifyProofType {
  DnsTxt = "DNS-TXT",
  DnsDid = "DNS-DID",
}

export enum QueueType {
  ISSUE = "ISSUE",
  REVOKE = "REVOKE",
}
