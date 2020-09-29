import React from "react";
import { WrappedDocument } from "../../../../types";
import { PublishTitle } from "./PublishTitle";

export default {
  title: "PublishPage|PublishedTitle",
  component: PublishTitle,
  parameters: {
    info: { inline: true, header: false },
  },
};

const mockDoc = [
  {
    type: "VERIFIABLE_DOCUMENT",
    contractAddress: "",
    fileName: "test",
    payload: {},
    rawDocument: {},
    wrappedDocument: { data: "test document" },
  },
] as WrappedDocument[];

export const preparing = () => {
  return <PublishTitle publishState={"INITIALIZED"} publishedDocuments={mockDoc} />;
};

export const publishing = () => {
  return <PublishTitle publishState={"PENDING_CONFIRMATION"} publishedDocuments={mockDoc} />;
};

export const documentSuccess = () => {
  return <PublishTitle publishState={"CONFIRMED"} publishedDocuments={mockDoc} />;
};

export const documentFailed = () => {
  return <PublishTitle publishState={"CONFIRMED"} publishedDocuments={[]} />;
};
