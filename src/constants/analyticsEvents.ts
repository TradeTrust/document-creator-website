export const ANALYTICS_EVENTS = {
  /** Fired when a user drops or selects a config file (or loads demo config). */
  CONFIG_FILE_DROPPED: "CONFIG_FILE_DROPPED",
  /** Fired when a user drops or selects a document to revoke. */
  REVOKE_DOCUMENT_DROPPED: "REVOKE_DOCUMENT_DROPPED",
  /** Fired when the user successfully starts a document form. */
  FORM_STARTED: "FORM_STARTED",
  /** Fired when document issuing completes with at least one success. */
  DOCUMENT_ISSUED: "DOCUMENT_ISSUED",
  /** Fired when document issuing fails (all jobs failed or queue error). */
  DOCUMENT_ISSUE_FAILED: "DOCUMENT_ISSUE_FAILED",
  /** Fired when document revoking completes with at least one success. */
  DOCUMENT_REVOKED: "DOCUMENT_REVOKED",
  /** Fired when document revoking fails (all jobs failed or queue error). */
  DOCUMENT_REVOKE_FAILED: "DOCUMENT_REVOKE_FAILED",
} as const;
