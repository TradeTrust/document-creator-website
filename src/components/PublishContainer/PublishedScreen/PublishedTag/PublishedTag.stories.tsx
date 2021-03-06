import React, { FunctionComponent } from "react";
import { WrappedDocument } from "../../../../types";
import { PublishedTag } from "./PublishedTag";

export default {
  title: "PublishPage/PublishedTag",
  component: PublishedTag,
  parameters: {
    componentSubtitle: "PublishedTag.",
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

export const Loading: FunctionComponent = () => {
  return <PublishedTag doc={mockDoc} isPending={true} />;
};

export const Default: FunctionComponent = () => {
  return <PublishedTag doc={mockDoc} isPending={false} />;
};
