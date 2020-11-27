import React, { FunctionComponent } from "react";
import { WrappedDocument } from "../../../../types";
import { PublishTitle } from "./PublishTitle";

export default {
  title: "PublishPage/PublishedTitle",
  component: PublishTitle,
  parameters: {
    componentSubtitle: "PublishedTitle.",
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

export const preparing: FunctionComponent = () => {
  return <PublishTitle publishState={"INITIALIZED"} publishedDocuments={mockDoc} />;
};

export const publishing: FunctionComponent = () => {
  return <PublishTitle publishState={"PENDING_CONFIRMATION"} publishedDocuments={mockDoc} />;
};

export const documentSuccess: FunctionComponent = () => {
  return <PublishTitle publishState={"CONFIRMED"} publishedDocuments={mockDoc} />;
};

export const documentFailed: FunctionComponent = () => {
  return <PublishTitle publishState={"CONFIRMED"} publishedDocuments={[]} />;
};
