import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import FileSaver from "file-saver";
import React from "react";
import { FailedJobErrors, WrappedDocument } from "../../../types";
import { PublishedScreen } from "./PublishedScreen";

jest.mock("file-saver", () => ({ saveAs: jest.fn() }));

const mockPublishedDocuments = [
  {
    contractAddress: "",
    fileName: "Document-1",
    payload: {},
    type: "VERIFIABLE_DOCUMENT",
    rawDocument: {},
    wrappedDocument: {
      data: {},
      signature: {},
      version: "",
    },
  },
] as WrappedDocument[];

const mockFailPublishedDocuments = [
  {
    error: new Error("error"),
    documents: [
      {
        contractAddress: "",
        fileName: "Document-3",
        payload: {},
        type: "VERIFIABLE_DOCUMENT",
        rawDocument: {},
        wrappedDocument: {
          data: {},
          signature: {},
          version: "",
        },
      },
    ],
  },
] as FailedJobErrors[];

describe("publishedScreen", () => {
  it("should display page correctly when document issued successfully", () => {
    render(
      <PublishedScreen
        publishedDocuments={mockPublishedDocuments}
        failedPublishedDocuments={mockFailPublishedDocuments}
        pendingPublishDocuments={[]}
        publishState={"CONFIRMED"}
      />
    );

    expect(screen.queryAllByText("Document(s) issued successfully")).toHaveLength(1);
    expect(screen.queryAllByTestId("publish-loader")).toHaveLength(0);
    expect(screen.queryAllByTestId("download-all-button")).toHaveLength(1);
  });

  it("should display published document section when there are published documents", () => {
    render(
      <PublishedScreen
        publishedDocuments={mockPublishedDocuments}
        failedPublishedDocuments={mockFailPublishedDocuments}
        pendingPublishDocuments={mockPublishedDocuments}
        publishState={"PENDING_CONFIRMATION"}
      />
    );

    expect(screen.queryAllByText("2 Document(s)")).toHaveLength(1);
    expect(screen.queryAllByText(/Publishing document/)).toHaveLength(1);
    expect(screen.queryAllByTestId("publish-loader")).toHaveLength(1);
  });

  it("should not display published document section when there are no published documents", () => {
    render(
      <PublishedScreen
        publishedDocuments={[]}
        failedPublishedDocuments={mockFailPublishedDocuments}
        pendingPublishDocuments={[]}
        publishState={"PENDING_CONFIRMATION"}
      />
    );

    expect(screen.queryAllByText("1 Document(s)")).toHaveLength(0);
    expect(screen.queryAllByText(/Publishing document/)).toHaveLength(1);
    expect(screen.queryAllByTestId("publish-loader")).toHaveLength(0);
  });

  it("should display failed published documents section when there are failed published documents", () => {
    render(
      <PublishedScreen
        publishedDocuments={mockPublishedDocuments}
        failedPublishedDocuments={mockFailPublishedDocuments}
        pendingPublishDocuments={mockPublishedDocuments}
        publishState={"PENDING_CONFIRMATION"}
      />
    );

    expect(screen.queryAllByText("1 Document(s) Failed")).toHaveLength(1);
    expect(screen.queryAllByText(/Publishing document/)).toHaveLength(1);
    expect(screen.queryAllByTestId("publish-loader")).toHaveLength(1);
  });

  it("should not display failed published documents section when there are no failed published documents", () => {
    render(
      <PublishedScreen
        publishedDocuments={mockPublishedDocuments}
        failedPublishedDocuments={[]}
        pendingPublishDocuments={mockPublishedDocuments}
        publishState={"PENDING_CONFIRMATION"}
      />
    );

    expect(screen.queryAllByText("1 Document(s) Failed")).toHaveLength(0);
    expect(screen.queryAllByText(/Publishing document/)).toHaveLength(1);
    expect(screen.queryAllByTestId("publish-loader")).toHaveLength(1);
  });

  it("should display the title correctly when publish state is 'CONFIRMED' and there are at least 1 published document", () => {
    render(
      <PublishedScreen
        publishedDocuments={mockPublishedDocuments}
        failedPublishedDocuments={[]}
        pendingPublishDocuments={[]}
        publishState={"CONFIRMED"}
      />
    );

    expect(screen.queryAllByText("1 Document(s)")).toHaveLength(1);
    expect(screen.queryAllByText("Document(s) issued successfully")).toHaveLength(1);
    expect(screen.queryAllByTestId("publish-loader")).toHaveLength(0);
  });

  it("should display the title correctly when publish state is 'CONFIRMED' and all documents failed", () => {
    render(
      <PublishedScreen
        publishedDocuments={[]}
        failedPublishedDocuments={mockFailPublishedDocuments}
        pendingPublishDocuments={[]}
        publishState={"CONFIRMED"}
      />
    );

    expect(screen.queryAllByText("1 Document(s)")).toHaveLength(0);
    expect(screen.queryAllByText("Document(s) failed to issue")).toHaveLength(1);
    expect(screen.queryAllByTestId("publish-loader")).toHaveLength(0);
  });

  it("should display 'preparing document' text when initializing documents", () => {
    render(
      <PublishedScreen
        publishedDocuments={[]}
        failedPublishedDocuments={[]}
        pendingPublishDocuments={[]}
        publishState={"INITIALIZED"}
      />
    );

    expect(screen.queryAllByText(/Please wait while we prepare your document/)).toHaveLength(1);
    expect(screen.queryAllByTestId("publish-loader")).toHaveLength(0);
  });

  it("should download the file correctly when generateZipFile method is called", async () => {
    render(
      <PublishedScreen
        publishedDocuments={mockPublishedDocuments}
        failedPublishedDocuments={[]}
        pendingPublishDocuments={[]}
        publishState={"CONFIRMED"}
      />
    );

    expect(screen.queryAllByTestId("download-all-button")).toHaveLength(1);

    await act(async () => {
      await fireEvent.click(screen.getByTestId("download-all-button"));
    });

    await waitFor(() => {
      expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);
    });
  });
});
