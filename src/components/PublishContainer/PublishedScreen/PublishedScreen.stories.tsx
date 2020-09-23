import React from "react";
import { FailedJobErrors, WrappedDocument } from "../../../types";
import { PublishedScreen } from "./PublishedScreen";

export default {
  title: "PublishPage|PublishedScreen",
  component: PublishedScreen,
  parameters: {
    info: { inline: true, header: false },
  },
};

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

export const Initialized = () => {
  return (
    <PublishedScreen
      publishedDocuments={[]}
      failedPublishedDocuments={[]}
      pendingPublishDocuments={[]}
      publishState={"INITIALIZED"}
    />
  );
};

export const Pending = () => {
  return (
    <PublishedScreen
      publishedDocuments={mockPublishedDocuments}
      failedPublishedDocuments={[]}
      pendingPublishDocuments={mockPublishedDocuments}
      publishState={"PENDING_CONFIRMATION"}
    />
  );
};

export const Confirmed = () => {
  return (
    <PublishedScreen
      publishedDocuments={mockPublishedDocuments}
      failedPublishedDocuments={mockFailPublishedDocuments}
      pendingPublishDocuments={[]}
      publishState={"CONFIRMED"}
    />
  );
};

export const Failed = () => {
  return (
    <PublishedScreen
      publishedDocuments={[]}
      failedPublishedDocuments={mockFailPublishedDocuments}
      pendingPublishDocuments={mockPublishedDocuments}
      publishState={"CONFIRMED"}
    />
  );
};
