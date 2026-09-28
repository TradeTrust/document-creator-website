import {
  pushGTMEvent,
  trackConfigFileDropped,
  trackRevokeDocumentDropped,
  trackFormStarted,
  trackDocumentIssued,
  trackDocumentIssueFailed,
  trackDocumentRevoked,
  trackDocumentRevokeFailed,
} from "./analytics";
import { ANALYTICS_EVENTS } from "../constants/analyticsEvents";

beforeEach(() => {
  window.dataLayer = [];
});

describe("pushGTMEvent", () => {
  it("pushes event to dataLayer", () => {
    pushGTMEvent({ event: "TEST_EVENT", foo: "bar" });
    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer[0]).toEqual({ event: "TEST_EVENT", foo: "bar" });
  });

  it("initialises dataLayer when undefined", () => {
    // @ts-expect-error testing missing dataLayer
    delete window.dataLayer;
    pushGTMEvent({ event: "INIT" });
    expect(window.dataLayer).toHaveLength(1);
  });
});

describe("trackConfigFileDropped", () => {
  it("pushes CONFIG_FILE_DROPPED with file name and source", () => {
    trackConfigFileDropped("config.json", "drop");
    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer[0]).toMatchObject({
      event: ANALYTICS_EVENTS.CONFIG_FILE_DROPPED,
      file_name: "config.json",
      source: "drop",
      environment: expect.any(String),
    });
  });
});

describe("trackRevokeDocumentDropped", () => {
  it("pushes REVOKE_DOCUMENT_DROPPED", () => {
    trackRevokeDocumentDropped("doc.tt", "file_picker");
    expect(window.dataLayer[0]).toMatchObject({
      event: ANALYTICS_EVENTS.REVOKE_DOCUMENT_DROPPED,
      file_name: "doc.tt",
      source: "file_picker",
    });
  });
});

describe("trackFormStarted", () => {
  it("pushes FORM_STARTED with form name", () => {
    trackFormStarted("Bill of Lading");
    expect(window.dataLayer[0]).toMatchObject({
      event: ANALYTICS_EVENTS.FORM_STARTED,
      form_name: "Bill of Lading",
    });
  });
});

describe("trackDocumentIssued", () => {
  it("pushes DOCUMENT_ISSUED with counts", () => {
    trackDocumentIssued(2, 1);
    expect(window.dataLayer[0]).toMatchObject({
      event: ANALYTICS_EVENTS.DOCUMENT_ISSUED,
      success_count: 2,
      failure_count: 1,
      document_count: 3,
    });
  });
});

describe("trackDocumentIssueFailed", () => {
  it("pushes DOCUMENT_ISSUE_FAILED with optional error message", () => {
    trackDocumentIssueFailed(0, 1, "network error");
    expect(window.dataLayer[0]).toMatchObject({
      event: ANALYTICS_EVENTS.DOCUMENT_ISSUE_FAILED,
      success_count: 0,
      failure_count: 1,
      error_message: "network error",
    });
  });
});

describe("trackDocumentRevoked", () => {
  it("pushes DOCUMENT_REVOKED with counts", () => {
    trackDocumentRevoked(1, 0);
    expect(window.dataLayer[0]).toMatchObject({
      event: ANALYTICS_EVENTS.DOCUMENT_REVOKED,
      success_count: 1,
      failure_count: 0,
      document_count: 1,
    });
  });
});

describe("trackDocumentRevokeFailed", () => {
  it("pushes DOCUMENT_REVOKE_FAILED", () => {
    trackDocumentRevokeFailed(0, 2, "tx failed");
    expect(window.dataLayer[0]).toMatchObject({
      event: ANALYTICS_EVENTS.DOCUMENT_REVOKE_FAILED,
      success_count: 0,
      failure_count: 2,
      error_message: "tx failed",
    });
  });
});
