import React from "react";
import { WrappedDocument } from "../../../../types";
import { PublishedTag } from "./PublishedTag";

export default {
  title: "PublishPage|PublishedTag",
  component: PublishedTag,
  parameters: {
    info: { inline: true, header: false },
  },
};

const mockDoc = {
  type: "VERIFIABLE_DOCUMENT",
  contractAddress: "",
  fileName: "test",
  payload: {},
  rawDocument: {},
  wrappedDocument: { data: "test document" },
} as WrappedDocument;

export const Loading = () => {
  return <PublishedTag doc={mockDoc} isPending={true} />;
};

export const Default = () => {
  return <PublishedTag doc={mockDoc} isPending={false} />;
};
