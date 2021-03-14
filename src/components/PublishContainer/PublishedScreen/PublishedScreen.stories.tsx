import React, { FunctionComponent } from "react";
import { FailedJobErrors, WrappedDocument } from "../../../types";
import { PublishedScreen } from "./PublishedScreen";
import { ConfigContextProvider, useConfigContext } from "../../../common/context/config";

export default {
  title: "PublishPage/PublishedScreen",
  component: PublishedScreen,
  parameters: {
    componentSubtitle: "PublishedScreen.",
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
      {
        contractAddress: "",
        fileName: "Document-2",
        payload: {},
        type: "VERIFIABLE_DOCUMENT",
        rawDocument: {},
        wrappedDocument: {
          data: {},
          signature: {},
          version: "",
        },
      },
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

const LoadConfig: FunctionComponent = () => {
  const { setConfig } = useConfigContext();
  setConfig({
    network: "rinkeby",
    wallet: "" as any,
    forms: [],
    documentStorage: {
      apiKey: "",
      url: "",
    },
  });
  return <>loading config...</>;
};

const App: FunctionComponent = ({ children }) => {
  const { config } = useConfigContext();
  return <>{config ? <>{children}</> : <LoadConfig />}</>;
};

const Root: FunctionComponent = ({ children }) => {
  // Root / App / LoadConfig is to mock how application is setup, so config context will work
  return (
    <ConfigContextProvider>
      <App>{children}</App>
    </ConfigContextProvider>
  );
};

export const Initialized: FunctionComponent = () => {
  return (
    <Root>
      <PublishedScreen
        publishedDocuments={[]}
        failedPublishedDocuments={[]}
        pendingPublishDocuments={[]}
        publishState={"INITIALIZED"}
      />
    </Root>
  );
};

export const Pending: FunctionComponent = () => {
  return (
    <Root>
      <PublishedScreen
        publishedDocuments={mockPublishedDocuments}
        failedPublishedDocuments={[]}
        pendingPublishDocuments={mockPublishedDocuments}
        publishState={"PENDING_CONFIRMATION"}
      />
    </Root>
  );
};

export const Confirmed: FunctionComponent = () => {
  return (
    <Root>
      <PublishedScreen
        publishedDocuments={mockPublishedDocuments}
        failedPublishedDocuments={[]}
        pendingPublishDocuments={[]}
        publishState={"CONFIRMED"}
      />
    </Root>
  );
};

export const Failed: FunctionComponent = () => {
  return (
    <Root>
      <PublishedScreen
        publishedDocuments={[]}
        failedPublishedDocuments={mockFailPublishedDocuments}
        pendingPublishDocuments={[]}
        publishState={"CONFIRMED"}
      />
    </Root>
  );
};
