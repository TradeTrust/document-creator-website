import { FunctionComponent } from "react";
import { WrappedDocument } from "../../../types";
import { ProcessDocumentTitle } from "./ProcessDocumentTitle";
import { QueueState, QueueType } from "../../../constants/QueueState";

export default {
  title: "ProcessDocumentScreen/ProcessDocumentTitle",
  component: ProcessDocumentTitle,
  parameters: {
    componentSubtitle: "ProcessDocumentTitle.",
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
  return <ProcessDocumentTitle queueState={QueueState.INITIALIZED} documents={mockDoc} type={QueueType.ISSUE} />;
};

export const publishing: FunctionComponent = () => {
  return <ProcessDocumentTitle queueState={QueueState.PENDING} documents={mockDoc} type={QueueType.ISSUE} />;
};

export const documentPublishSuccess: FunctionComponent = () => {
  return <ProcessDocumentTitle queueState={QueueState.CONFIRMED} documents={mockDoc} type={QueueType.ISSUE} />;
};

export const documentPublishedFailed: FunctionComponent = () => {
  return <ProcessDocumentTitle queueState={QueueState.CONFIRMED} documents={[]} type={QueueType.ISSUE} />;
};

export const revoking: FunctionComponent = () => {
  return <ProcessDocumentTitle queueState={QueueState.PENDING} documents={mockDoc} type={QueueType.REVOKE} />;
};

export const documentRevokeSuccess: FunctionComponent = () => {
  return <ProcessDocumentTitle queueState={QueueState.CONFIRMED} documents={mockDoc} type={QueueType.REVOKE} />;
};

export const documentRevokedFailed: FunctionComponent = () => {
  return <ProcessDocumentTitle queueState={QueueState.CONFIRMED} documents={[]} type={QueueType.REVOKE} />;
};
