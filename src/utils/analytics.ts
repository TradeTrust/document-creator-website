import { DropEvent } from "react-dropzone";
import { ANALYTICS_EVENTS } from "../constants/analyticsEvents";

export interface GTMEvent {
  event: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer: GTMEvent[];
  }
}

export type ConfigFileDroppedSource = "drop" | "file_picker" | "demo";

export type RevokeDocumentDroppedSource = "drop" | "file_picker";

/** Known custom params — cleared before each push so stale values do not carry into later events. */
const ANALYTICS_PARAM_KEYS = [
  "environment",
  "source",
  "form_name",
  "success_count",
  "failure_count",
  "document_count",
  "error_category",
] as const;

/**
 * Pushes an event to window.dataLayer only — no external calls are made here.
 * GTM (if loaded) reads from dataLayer and forwards events per its own config.
 * Events pushed before GTM loads are queued and replayed when GTM initialises.
 * Safe to call from any context: silently no-ops when window is unavailable, never throws.
 */
export const pushGTMEvent = (eventData: GTMEvent): void => {
  try {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(eventData);
  } catch {
    // Analytics failures must never affect the application
  }
};

const ENVIRONMENT = (process.env.REACT_APP_PLATFORM as string | undefined) ?? "local";

const trackEvent = (payload: GTMEvent): void => {
  const cleared: GTMEvent = { event: payload.event };
  for (const key of ANALYTICS_PARAM_KEYS) {
    cleared[key] = undefined;
  }
  pushGTMEvent({ ...cleared, ...payload });
};

export const trackConfigFileDropped = (source: ConfigFileDroppedSource = "file_picker"): void => {
  trackEvent({
    event: ANALYTICS_EVENTS.CONFIG_FILE_DROPPED,
    environment: ENVIRONMENT,
    source,
  });
};

export const trackRevokeDocumentDropped = (source: RevokeDocumentDroppedSource = "file_picker"): void => {
  trackEvent({
    event: ANALYTICS_EVENTS.REVOKE_DOCUMENT_DROPPED,
    environment: ENVIRONMENT,
    source,
  });
};

export const trackFormStarted = (formName: string): void => {
  trackEvent({
    event: ANALYTICS_EVENTS.FORM_STARTED,
    environment: ENVIRONMENT,
    form_name: formName,
  });
};

export const trackDocumentIssued = (successCount: number, failureCount: number): void => {
  trackEvent({
    event: ANALYTICS_EVENTS.DOCUMENT_ISSUED,
    environment: ENVIRONMENT,
    success_count: successCount,
    failure_count: failureCount,
    document_count: successCount + failureCount,
  });
};

export const trackDocumentIssueFailed = (successCount: number, failureCount: number): void => {
  trackEvent({
    event: ANALYTICS_EVENTS.DOCUMENT_ISSUE_FAILED,
    environment: ENVIRONMENT,
    success_count: successCount,
    failure_count: failureCount,
    document_count: successCount + failureCount,
    error_category: "issue_failed",
  });
};

export const trackDocumentRevoked = (successCount: number, failureCount: number): void => {
  trackEvent({
    event: ANALYTICS_EVENTS.DOCUMENT_REVOKED,
    environment: ENVIRONMENT,
    success_count: successCount,
    failure_count: failureCount,
    document_count: successCount + failureCount,
  });
};

export const trackDocumentRevokeFailed = (successCount: number, failureCount: number): void => {
  trackEvent({
    event: ANALYTICS_EVENTS.DOCUMENT_REVOKE_FAILED,
    environment: ENVIRONMENT,
    success_count: successCount,
    failure_count: failureCount,
    document_count: successCount + failureCount,
    error_category: "revoke_failed",
  });
};

/** Resolve drop-zone interaction source from the react-dropzone event. */
export const resolveDropZoneSource = (event?: DropEvent): "drop" | "file_picker" =>
  event?.type === "drop" ? "drop" : "file_picker";
