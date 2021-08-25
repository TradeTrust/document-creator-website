import prettyBytes from "pretty-bytes";
import { Wrapper } from "../UI/Wrapper";
import { Download, XCircle } from "react-feather";
import { ProgressBar } from "../ProgressBar";
import { FunctionComponent, useEffect } from "react";
import { Config, FormEntry } from "../../types";
import { QueueType, QueueState } from "../../constants/QueueState";
import { useQueue } from "../../common/hook/useQueue";
import { generateZipFile, generateFileName, getFileSize } from "../../utils";
import { ProcessDocumentTitle } from "./ProcessDocumentTitle";
import { Button, LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import { ProcessedDocumentTag } from "./ProcessedDocumentTag";

interface ProcessDocumentScreen {
  config: Config;
  processAnotherDocument: () => void;
  forms?: FormEntry[];
  revokeDocuments?: any[];
  fileName?: string;
  type: QueueType;
}

export const ProcessDocumentScreen: FunctionComponent<ProcessDocumentScreen> = ({
  config,
  processAnotherDocument,
  forms,
  revokeDocuments,
  fileName,
  type,
}) => {
  const isIssuingFlow = type === QueueType.ISSUE;

  const useQueueParameters = isIssuingFlow ? { config, formEntries: forms } : { config, documents: revokeDocuments };

  const {
    processDocuments,
    queueState,
    successfulProcessedDocuments,
    failedProcessedDocuments,
    pendingProcessDocuments,
    error,
  } = useQueue(useQueueParameters);

  useEffect(() => {
    processDocuments(type);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const failPublishedDocuments = failedProcessedDocuments.map((failedJob) => failedJob.documents).flat();

  const formattedErrorLog = failedProcessedDocuments.map((failedJob) => {
    const fileNames = failedJob.documents.map((document) => document.fileName).join(", ");
    return {
      files: fileNames,
      error: failedJob.error,
    };
  });

  return (
    <Wrapper>
      <ProgressBar step={3} totalSteps={3} title={isIssuingFlow ? "Issue Document(s)" : "Revoked Document"} />
      <div className="flex justify-between items-end" data-testid="processing-screen">
        <ProcessDocumentTitle queueState={queueState} documents={successfulProcessedDocuments} type={type} />
        {queueState === QueueState.CONFIRMED && (
          <Button
            className="bg-white text-orange hover:bg-gray-100 mb-6 mr-4"
            data-testid="process-another-document-button"
            onClick={processAnotherDocument}
          >
            {`${isIssuingFlow ? "Create" : "Revoke"} another Document`}
          </Button>
        )}
      </div>
      <div className="bg-gray-100 py-6 h-full">
        {queueState === QueueState.INITIALIZED && (
          <div className="flex items-center justify-center">
            <LoaderSpinner
              className="mr-4 flex-shrink-0"
              data-testid="preparing-loader"
              width="48px"
              primary="#00cbbc"
              secondary="#e2e8f0"
            />
          </div>
        )}
        {(pendingProcessDocuments.length > 0 || successfulProcessedDocuments.length > 0) &&
          queueState !== QueueState.ERROR && (
            <div className="container">
              <div className="border-b border-solid border-gray-200 flex items-center">
                <div
                  className="text-gray font-medium text-lg mb-4 flex-grow py-3"
                  data-testid="total-number-of-documents"
                >
                  {successfulProcessedDocuments.length + pendingProcessDocuments.length} Document(s)
                </div>
                {queueState === QueueState.CONFIRMED && isIssuingFlow && (
                  <Button
                    className="bg-white text-blue hover:bg-gray-100 mb-4"
                    data-testid="download-all-button"
                    onClick={() => {
                      generateZipFile(successfulProcessedDocuments, config?.network);
                    }}
                  >
                    <div className="flex">
                      <Download />
                      <div className="text-blue ml-2">Download all</div>
                    </div>
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap border-b border-solid border-gray-200 pb-4 mb-4">
                {successfulProcessedDocuments.map((doc, index) => (
                  <ProcessedDocumentTag doc={doc} key={index} isPending={false} type={type} fileName={fileName} />
                ))}
                {pendingProcessDocuments.map((doc, index) => (
                  <ProcessedDocumentTag doc={doc} key={index} isPending={true} type={type} fileName={fileName} />
                ))}
              </div>
            </div>
          )}
        {failPublishedDocuments && failPublishedDocuments.length > 0 && queueState !== QueueState.ERROR && (
          <div className="container">
            <div className="text-gray font-medium text-lg my-6">{failPublishedDocuments.length} Document(s) Failed</div>
            <div className="bg-red-100 p-3 flex flex-col">
              <div className="flex">
                <XCircle className="text-rose" />
                <div className="text-rose ml-2 flex-grow" data-testid="error-message">
                  These documents failed to publish due to some errors. Kindly rectify and try publishing again.
                </div>
                <Button className="bg-white text-rose hover:bg-gray-100">
                  <a
                    download={generateFileName({
                      network: config?.network,
                      fileName: "error-log",
                      extension: "txt",
                      hasTimestamp: true,
                    })}
                    href={`data:text/plain;charset=UTF-8,${JSON.stringify(formattedErrorLog, null, 2)}`}
                  >
                    <div className="flex">
                      <Download />
                      <div className="text-rose ml-2">Download Error Log</div>
                    </div>
                  </a>
                </Button>
              </div>
              {failPublishedDocuments.map((doc, index) => {
                const size = prettyBytes(getFileSize(JSON.stringify(doc.wrappedDocument)));
                return (
                  <div key={index} className="flex items-center">
                    <div className="font-bold text-gray">
                      {generateFileName({
                        network: config?.network,
                        fileName: doc.fileName,
                        extension: doc.extension,
                      })}
                    </div>
                    <div className="text-xs text-gray ml-1">({size})</div>
                  </div>
                );
              })}
            </div>
            <div className="flex py-4">
              <div className="col-auto ml-auto">
                <Button
                  className="bg-white text-blue hover:bg-gray-100 mb-4"
                  data-testid="download-fail-button"
                  onClick={() => {
                    generateZipFile(failedProcessedDocuments[0].documents);
                  }}
                >
                  <div className="flex">
                    <Download />
                    <div className="text-blue ml-2">Download Failed Files</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}
        {queueState === QueueState.ERROR && (
          <div className="container">
            <div className="bg-red-100 p-3 flex flex-col">
              <div className="flex">
                <XCircle className="text-rose" />
                <div className="flex flex-col flex-grow">
                  <div className="text-rose ml-2 flex-grow" data-testid="error-title">
                    {`Failed to ${isIssuingFlow ? "publish" : "revoke"} due to:`}
                  </div>
                  <div className="text-rose ml-2 flex-grow">- {error?.message}</div>
                  <div className="text-rose ml-2 flex-grow">
                    {`Kindly rectify and try ${isIssuingFlow ? "publishing" : "revoking"} again.`}
                  </div>
                </div>
                <Button className="bg-white text-rose hover:bg-gray-100 h-12">
                  <a
                    download={generateFileName({
                      network: config?.network,
                      fileName: "error-log",
                      extension: "txt",
                      hasTimestamp: true,
                    })}
                    href={`data:text/plain;charset=UTF-8,${JSON.stringify(error, null, 2)}`}
                  >
                    <div className="flex">
                      <Download />
                      <div className="text-rose ml-2">Download Error Log</div>
                    </div>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};
