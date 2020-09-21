import prettyBytes from "pretty-bytes";
import React, { FunctionComponent } from "react";
import { useConfigContext } from "../../../common/context/config";
import { useFormsContext } from "../../../common/context/forms";
import { FailedJobErrors, WrappedDocument } from "../../../types";
import { generateFileName } from "../../../utils/fileName";
import { Container } from "../../Container";
import { ProgressBar } from "../../ProgressBar";
import { Button } from "../../UI/Button";
import { CheckCircle, Download, XCircle } from "react-feather";
import { Title } from "../../UI/Title";
import { PublishedTag } from "../PublishedScreen/PublishedTag";

interface PublishScreen {
  publishedDocuments: WrappedDocument[];
  failedPublishedDocuments: FailedJobErrors[];
}

export const PublishedScreen: FunctionComponent<PublishScreen> = ({
  publishedDocuments,
  failedPublishedDocuments,
}) => {
  const { setConfig, config } = useConfigContext();
  const { setForms, setActiveFormIndex } = useFormsContext();

  const createAnotherDoc = (): void => {
    setForms([]);
    setActiveFormIndex(undefined);
  };

  const onDone = (): void => {
    setForms([]);
    setActiveFormIndex(undefined);
    setConfig(undefined);
  };

  const getFileSize = (jsonString: string): number => {
    const m = encodeURIComponent(jsonString).match(/%[89ABab]/g);
    return jsonString.length + (m ? m.length : 0);
  };

  const failPublishedDocuments = failedPublishedDocuments
    .map((failedjob) => failedjob.documents)
    .flat();

  const formattedErrorLog = failedPublishedDocuments.map((failedJob) => {
    const fileNames = failedJob.documents.map((document) => document.fileName).join(", ");
    return {
      files: fileNames,
      error: failedJob.error,
    };
  });

  return (
    <Container>
      <div className="container mx-auto pt-8">
        <ProgressBar step={3} />
        <div className="flex justify-between items-end">
          <Title className="flex items-center mb-8">
            <CheckCircle className="mr-2 text-teal" />
            {publishedDocuments.length > 0
              ? "Document(s) issued successfully"
              : "Document(s) failed to issue"}
          </Title>
          <div>
            <Button className="bg-white text-orange px-4 py-3 mb-6 mr-4" onClick={createAnotherDoc}>
              Create another Document
            </Button>
            <Button
              className="bg-orange text-white self-end py-3 px-4 mb-6"
              data-testid="form-logout-button"
              onClick={onDone}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-lightgrey-lighter p-6 h-screen">
        {publishedDocuments && publishedDocuments.length > 0 && (
          <div className="container mx-auto">
            <div className="border-b border-solid border-lightgrey">
              <div className="text-grey font-medium text-lg mb-4">
                {publishedDocuments.length} Document(s)
              </div>
            </div>
            <div className="flex flex-wrap border-b border-solid border-lightgrey pb-4 mb-4">
              {publishedDocuments.map((doc, index) => (
                <PublishedTag doc={doc} key={index} />
              ))}
            </div>
          </div>
        )}
        {failPublishedDocuments && failPublishedDocuments.length > 0 && (
          <div className="container mx-auto">
            <div className="text-grey font-medium text-lg mb-4">
              {failPublishedDocuments.length} Document(s) Failed
            </div>
            <div className="bg-red-lighter p-3 flex flex-col">
              <div className="flex">
                <XCircle className="text-red" />
                <div className="text-red ml-2 flex-grow">
                  These documents failed to publish due to some errors. Kindly rectify and try
                  publishing again.
                </div>
                <Button className="bg-white text-red px-4 py-3">
                  <a
                    download={generateFileName(config, "error-log", "txt")}
                    href={`data:text/plain;charset=UTF-8,${JSON.stringify(
                      formattedErrorLog,
                      null,
                      2
                    )}`}
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
                    <div className="font-bold text-lightgrey-dark">
                      {generateFileName(config, doc.fileName, "tt")}
                    </div>
                    <div className="text-xs text-lightgrey-dark ml-1">({size})</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};
