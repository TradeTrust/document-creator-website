import { render, screen } from "@testing-library/react";
import React from "react";
import { FailedJobErrors, WrappedDocument } from "../../../types";
import { PublishedScreen } from "./PublishedScreen";

const mockPublishedDocuments = [
  {
    contractAddress: "",
    fileName: "Document-1.tt",
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
        fileName: "Document-3.tt",
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
  it("should display page when everything is ok", () => {
    render(
      <PublishedScreen
        publishedDocuments={mockPublishedDocuments}
        failedPublishedDocuments={mockFailPublishedDocuments}
      />
    );

    expect(screen.queryAllByText("Document(s) issued successfully")).toHaveLength(1);
  });

  it("should display published document section when there are published documents", () => {
    render(
      <PublishedScreen
        publishedDocuments={mockPublishedDocuments}
        failedPublishedDocuments={mockFailPublishedDocuments}
      />
    );

    expect(screen.queryAllByText("1 Document(s)")).toHaveLength(1);
  });

  it("should not display published document section when there are no published documents", () => {
    render(
      <PublishedScreen
        publishedDocuments={[]}
        failedPublishedDocuments={mockFailPublishedDocuments}
      />
    );

    expect(screen.queryAllByText("1 Document(s)")).toHaveLength(0);
  });

  it("should display failed published documents section when there are failed published documents", () => {
    render(
      <PublishedScreen
        publishedDocuments={mockPublishedDocuments}
        failedPublishedDocuments={mockFailPublishedDocuments}
      />
    );

    expect(screen.queryAllByText("1 Document(s) Failed")).toHaveLength(1);
  });

  it("should not display failed published documents section when there are no failed published documents", () => {
    render(
      <PublishedScreen publishedDocuments={mockPublishedDocuments} failedPublishedDocuments={[]} />
    );

    expect(screen.queryAllByText("1 Document(s) Failed")).toHaveLength(0);
  });
});
