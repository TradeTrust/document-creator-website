import {
  pushGTMEvent,
  trackConfigFileDropped,
  trackRevokeDocumentDropped,
  trackFormStarted,
  trackDocumentIssued,
  trackDocumentIssueFailed,
  trackDocumentRevoked,
  trackDocumentRevokeFailed,
  resolveDropZoneSource,
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
  it("pushes CONFIG_FILE_DROPPED with source only", () => {
    trackConfigFileDropped("drop");
    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer[0]).toMatchObject({
      event: ANALYTICS_EVENTS.CONFIG_FILE_DROPPED,
      source: "drop",
      environment: expect.any(String),
    });
    expect(window.dataLayer[0]).not.toHaveProperty("file_name");
  });
});

describe("trackRevokeDocumentDropped", () => {
  it("pushes REVOKE_DOCUMENT_DROPPED", () => {
    trackRevokeDocumentDropped("file_picker");
    expect(window.dataLayer[0]).toMatchObject({
      event: ANALYTICS_EVENTS.REVOKE_DOCUMENT_DROPPED,
      source: "file_picker",
    });
    expect(window.dataLayer[0]).not.toHaveProperty("file_name");
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

  it("clears params from a prior event so they do not carry over", () => {
    trackConfigFileDropped("drop");
    trackFormStarted("Invoice");
    const last = window.dataLayer[window.dataLayer.length - 1];
    expect(last.source).toBeUndefined();
    expect(last.form_name).toBe("Invoice");
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
  it("pushes DOCUMENT_ISSUE_FAILED with a fixed error category", () => {
    trackDocumentIssueFailed(0, 1);
    expect(window.dataLayer[0]).toMatchObject({
      event: ANALYTICS_EVENTS.DOCUMENT_ISSUE_FAILED,
      success_count: 0,
      failure_count: 1,
      error_category: "issue_failed",
    });
    expect(window.dataLayer[0]).not.toHaveProperty("error_message");
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
  it("pushes DOCUMENT_REVOKE_FAILED with a fixed error category", () => {
    trackDocumentRevokeFailed(0, 2);
    expect(window.dataLayer[0]).toMatchObject({
      event: ANALYTICS_EVENTS.DOCUMENT_REVOKE_FAILED,
      success_count: 0,
      failure_count: 2,
      error_category: "revoke_failed",
    });
    expect(window.dataLayer[0]).not.toHaveProperty("error_message");
  });
});

describe("resolveDropZoneSource", () => {
  it("returns drop for drop events", () => {
    expect(resolveDropZoneSource({ type: "drop" } as Event)).toBe("drop");
  });

  it("returns file_picker for file dialog / other events", () => {
    expect(resolveDropZoneSource({ type: "change" } as Event)).toBe("file_picker");
    expect(resolveDropZoneSource(undefined)).toBe("file_picker");
  });
});
