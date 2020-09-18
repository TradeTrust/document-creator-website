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

export const Default = () => {
  return (
    <PublishedScreen
      publishedDocuments={mockPublishedDocuments}
      failedPublishedDocuments={mockFailPublishedDocuments}
    />
  );
};
