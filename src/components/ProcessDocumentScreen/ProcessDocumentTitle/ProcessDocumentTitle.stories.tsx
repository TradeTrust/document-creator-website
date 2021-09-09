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
  return (
    <ProcessDocumentTitle
      queueState={QueueState.INITIALIZED}
      successfulDocumentsCount={mockDoc.length}
      type={QueueType.ISSUE}
    />
  );
};

export const publishing: FunctionComponent = () => {
  return (
    <ProcessDocumentTitle
      queueState={QueueState.PENDING}
      successfulDocumentsCount={mockDoc.length}
      type={QueueType.ISSUE}
    />
  );
};

export const documentPublishSuccess: FunctionComponent = () => {
  return (
    <ProcessDocumentTitle
      queueState={QueueState.CONFIRMED}
      successfulDocumentsCount={mockDoc.length}
      type={QueueType.ISSUE}
    />
  );
};

export const documentPublishedFailed: FunctionComponent = () => {
  return <ProcessDocumentTitle queueState={QueueState.CONFIRMED} successfulDocumentsCount={0} type={QueueType.ISSUE} />;
};

export const revoking: FunctionComponent = () => {
  return (
    <ProcessDocumentTitle
      queueState={QueueState.PENDING}
      successfulDocumentsCount={mockDoc.length}
      type={QueueType.REVOKE}
    />
  );
};

export const documentRevokeSuccess: FunctionComponent = () => {
  return (
    <ProcessDocumentTitle
      queueState={QueueState.CONFIRMED}
      successfulDocumentsCount={mockDoc.length}
      type={QueueType.REVOKE}
    />
  );
};

export const documentRevokedFailed: FunctionComponent = () => {
  return (
    <ProcessDocumentTitle queueState={QueueState.CONFIRMED} successfulDocumentsCount={0} type={QueueType.REVOKE} />
  );
};
