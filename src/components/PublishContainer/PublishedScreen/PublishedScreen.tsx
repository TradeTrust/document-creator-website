import { Button } from "@govtechsg/tradetrust-ui-components";
import prettyBytes from "pretty-bytes";
import React, { FunctionComponent } from "react";
import { Download, XCircle } from "react-feather";
import { useConfigContext } from "../../../common/context/config";
import { PublishState } from "../../../constants/PublishState";
import { FailedJobErrors, WrappedDocument } from "../../../types";
import { generateFileName, generateZipFile, getFileSize } from "../../../utils";
import { ProgressBar } from "../../ProgressBar";
import { Wrapper } from "../../UI/Wrapper";
import { PublishedTag } from "../PublishedScreen/PublishedTag";
import { PublishTitle } from "./PublishTitle";

interface PublishScreen {
  publishedDocuments: WrappedDocument[];
  failedPublishedDocuments: FailedJobErrors[];
  pendingPublishDocuments: WrappedDocument[];
  publishState: PublishState;
}

export const PublishedScreen: FunctionComponent<PublishScreen> = ({
  publishedDocuments,
  failedPublishedDocuments,
  pendingPublishDocuments,
  publishState,
}) => {
  const { config } = useConfigContext();

  const failPublishedDocuments = failedPublishedDocuments.map((failedJob) => failedJob.documents).flat();

  const formattedErrorLog = failedPublishedDocuments.map((failedJob) => {
    const fileNames = failedJob.documents.map((document) => document.fileName).join(", ");
    return {
      files: fileNames,
      error: failedJob.error,
    };
  });

  return (
    <Wrapper>
      <ProgressBar step={3} totalSteps={3} title="Issue Document(s)" />
      <div className="flex justify-between items-end">
        <PublishTitle publishState={publishState} publishedDocuments={publishedDocuments} />
      </div>
      <div className="bg-grey-100 py-6 h-full">
        {(pendingPublishDocuments.length > 0 || publishedDocuments.length > 0) && (
          <div className="container">
            <div className="border-b border-solid border-grey-200 flex items-center">
              <div className="text-grey font-medium text-lg mb-4 flex-grow py-3">
                {publishedDocuments.length + pendingPublishDocuments.length} Document(s)
              </div>
              {publishState === PublishState.CONFIRMED && (
                <Button
                  className="bg-white text-blue hover:bg-grey-100 mb-4"
                  data-testid="download-all-button"
                  onClick={() => {
                    generateZipFile(publishedDocuments, config?.network);
                  }}
                >
                  <div className="flex">
                    <Download />
                    <div className="text-blue ml-2">Download all</div>
                  </div>
                </Button>
              )}
            </div>
            <div className="flex flex-wrap border-b border-solid border-grey-200 pb-4 mb-4">
              {publishedDocuments.map((doc, index) => (
                <PublishedTag doc={doc} key={index} isPending={false} />
              ))}
              {pendingPublishDocuments.map((doc, index) => (
                <PublishedTag doc={doc} key={index} isPending={true} />
              ))}
            </div>
          </div>
        )}
        {failPublishedDocuments && failPublishedDocuments.length > 0 && (
          <div className="container">
            <div className="text-grey font-medium text-lg my-6">{failPublishedDocuments.length} Document(s) Failed</div>
            <div className="bg-red-100 p-3 flex flex-col">
              <div className="flex">
                <XCircle className="text-red" />
                <div className="text-red ml-2 flex-grow">
                  These documents failed to publish due to some errors. Kindly rectify and try publishing again.
                </div>
                <Button className="bg-white text-red hover:bg-grey-100">
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
                      <div className="text-red ml-2">Download Error Log</div>
                    </div>
                  </a>
                </Button>
              </div>
              {failPublishedDocuments.map((doc, index) => {
                const size = prettyBytes(getFileSize(JSON.stringify(doc.wrappedDocument)));
                return (
                  <div key={index} className="flex items-center">
                    <div className="font-bold text-grey">
                      {generateFileName({
                        network: config?.network,
                        fileName: doc.fileName,
                        extension: doc.extension,
                      })}
                    </div>
                    <div className="text-xs text-grey ml-1">({size})</div>
                  </div>
                );
              })}
            </div>
            <div className="flex py-4">
              <div className="col-auto ml-auto">
                <Button
                  className="bg-white text-blue hover:bg-grey-100 mb-4"
                  data-testid="download-fail-button"
                  onClick={() => {
                    generateZipFile(failedPublishedDocuments[0].documents);
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
      </div>
    </Wrapper>
  );
};
