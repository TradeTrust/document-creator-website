import { Wrapper } from "../UI/Wrapper";
import { Download } from "react-feather";
import { ProgressBar } from "../ProgressBar";
import { FunctionComponent, useEffect } from "react";
import { Config, FormEntry } from "../../types";
import { QueueType, QueueState } from "../../constants/QueueState";
import { useQueue } from "../../common/hook/useQueue";
import { generateFileName, generateZipFile } from "../../utils";
import { ProcessDocumentTitle } from "./ProcessDocumentTitle";
import { Button, LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import { ProcessedDocumentTag } from "./ProcessedDocumentTag";
import { Card } from "../UI/Card";
import { ContentFrame } from "../UI/ContentFrame";
import { ErrorCard } from "../UI/ErrorCard";

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

  const ErrorLogButton = () => {
    return (
      <Button className="bg-rose flex mx-auto border-rose hover:bg-rose-400">
        <a
          className="text-white hover:text-white"
          download={generateFileName({
            network: config?.network,
            fileName: "error-log",
            extension: "txt",
            hasTimestamp: true,
          })}
          href={`data:text/plain;charset=UTF-8,${JSON.stringify(formattedErrorLog, null, 2)}`}
        >
          Download Error Log
        </a>
      </Button>
    );
  };

  const TryAgainButton = () => {
    return (
      <Button
        className="bg-cerulean text-white hover:bg-cerulean-400 flex mx-auto"
        onClick={() => processDocuments(type)}
      >
        Try Again
      </Button>
    );
  };

  const CreateAnotherButton = () => {
    return (
      <Button
        className="bg-cerulean text-white hover:bg-cerulean-400 flex mx-auto"
        data-testid="process-another-document-button"
        onClick={processAnotherDocument}
      >
        {`${isIssuingFlow ? "Create" : "Revoke"} another Document`}
      </Button>
    );
  };

  const DownloadAllButton = () => {
    return (
      <Button
        className="bg-white text-cerulean hover:bg-cloud-100 mb-4"
        data-testid="download-all-button"
        onClick={() => {
          generateZipFile(successfulProcessedDocuments, config?.network);
        }}
      >
        <div className="flex">
          <Download />
          <div className="text-cerulean ml-2">Download all</div>
        </div>
      </Button>
    );
  };

  return (
    <Wrapper>
      <ContentFrame>
        <Card>
          <ProgressBar step={3} totalSteps={3} title={isIssuingFlow ? "Issue Document(s)" : "Revoked Document"} />
          <div className="flex justify-between items-end" data-testid="processing-screen">
            <ProcessDocumentTitle queueState={queueState} documents={successfulProcessedDocuments} type={type} />
          </div>
          <div className="py-6 h-full">
            <div className="mb-4 flex-grow py-3" data-testid="total-number-of-documents">
              {successfulProcessedDocuments.length + pendingProcessDocuments.length + failedProcessedDocuments.length}
              {isIssuingFlow ? " document(s)" : " document"}
            </div>
            {queueState === QueueState.INITIALIZED && (
              <div className="flex items-center justify-center mb-4">
                <LoaderSpinner
                  className="mr-4 flex-shrink-0"
                  data-testid="preparing-loader"
                  width="48px"
                  primary="#3B8CC5"
                />
              </div>
            )}

            {failPublishedDocuments && failPublishedDocuments.length > 0 && queueState !== QueueState.ERROR && (
              <>
                <ErrorCard
                  title={`The document(s) could not be ${isIssuingFlow ? "issued" : "revoked"} at this time.`}
                  description={
                    successfulProcessedDocuments.length === 0
                      ? `Please contact TradeTrust via email or client representative to resolve your issue. Alternatively, please try again.`
                      : failPublishedDocuments.reduce((acc, curr) => {
                          return (acc += curr.fileName + "\n");
                        }, "")
                  }
                  button={<ErrorLogButton />}
                />
                {successfulProcessedDocuments.length === 0 && (
                  <div className="py-3">
                    {failPublishedDocuments.map((doc, index) => {
                      return (
                        <ProcessedDocumentTag
                          isError
                          doc={doc}
                          key={index}
                          isPending={false}
                          type={type}
                          fileName={doc.fileName}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            )}
            {queueState === QueueState.ERROR && (
              <ErrorCard
                title={`The document(s) could not be ${isIssuingFlow ? "issued" : "revoked"} at this time.`}
                description={`Please contact TradeTrust via email or client representative to resolve your issue. Alternatively, please try again.`}
                button={<ErrorLogButton />}
              />
            )}
            {(pendingProcessDocuments.length > 0 || successfulProcessedDocuments.length > 0) &&
              queueState !== QueueState.ERROR && (
                <div className="flex justify-between pb-4 mb-4 mt-4">
                  <div>
                    {successfulProcessedDocuments.map((doc, index) => (
                      <ProcessedDocumentTag doc={doc} key={index} isPending={false} type={type} fileName={fileName} />
                    ))}
                    {pendingProcessDocuments.map((doc, index) => (
                      <ProcessedDocumentTag doc={doc} key={index} isPending={true} type={type} fileName={fileName} />
                    ))}
                  </div>
                  <div className="my-4">
                    {queueState === QueueState.CONFIRMED && isIssuingFlow && <DownloadAllButton />}
                  </div>
                </div>
              )}
            {queueState === QueueState.CONFIRMED &&
              (failPublishedDocuments.length > 0 && successfulProcessedDocuments.length === 0 ? (
                <TryAgainButton />
              ) : (
                <CreateAnotherButton />
              ))}
          </div>
        </Card>
      </ContentFrame>
    </Wrapper>
  );
};
