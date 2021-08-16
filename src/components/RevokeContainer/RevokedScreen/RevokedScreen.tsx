import { FunctionComponent, ReactElement, useEffect } from "react";
import prettyBytes from "pretty-bytes";
import { ProgressBar } from "../../ProgressBar";
import { Wrapper } from "../../UI/Wrapper";
import { RevokeState } from "../../../constants/RevokeState";
import { useRevokeQueue } from "../../../common/hook/useRevokeQueue";
import { Config } from "../../../types";
import { CheckCircle, XCircle, Download } from "react-feather";
import { Button, LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import { Title } from "../../UI/Title";
import { generateZipFile, generateFileName, getFileSize } from "../../../utils";
import { RevokeTag } from "../RevokeTag/RevokeTag";

interface RevokeScreenProps {
  config: Config;
  revokeDocuments: any[];
  revokeAnotherDocument: () => void;
  fileName: string;
}

export const RevokedScreen: FunctionComponent<RevokeScreenProps> = ({
  config,
  revokeDocuments,
  revokeAnotherDocument,
  fileName,
}) => {
  const { revoke, revokeState, revokedDocuments, failedRevokedDocuments, pendingRevokeDocuments } = useRevokeQueue(
    config,
    revokeDocuments
  );

  useEffect(() => {
    revoke();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getDisplayTitle = (): ReactElement => {
    switch (revokeState) {
      case RevokeState.PENDING:
        return (
          <>
            <LoaderSpinner className="mr-2" width="24px" primary="#00cbbc" secondary="#e2e8f0" />
            Revoking document(s)...
          </>
        );

      case RevokeState.CONFIRMED:
        if (revokedDocuments.length > 0) {
          return (
            <>
              <CheckCircle className="mr-2 text-teal" />
              Document(s) revoked successfully
            </>
          );
        } else {
          return (
            <>
              <XCircle className="mr-2 text-red" />
              Document(s) failed to revoke
            </>
          );
        }

      default:
        return <>Please wait while we prepare your document(s)</>;
    }
  };

  const allFailedRevokedDocuments = failedRevokedDocuments.map((failedJob) => failedJob.documents).flat();

  const formattedErrorLog = failedRevokedDocuments.map((failedJob) => {
    const fileNames = failedJob.documents.map((document) => document.fileName).join(", ");
    return {
      files: fileNames,
      error: failedJob.error,
    };
  });

  return (
    <Wrapper>
      <ProgressBar step={3} totalSteps={3} title="Revoked Document" />
      <div className="flex justify-between items-end" data-testid="revoke-screen">
        <Title className="flex items-center mb-8" data-testid="title">
          {getDisplayTitle()}
        </Title>
        {revokeState === RevokeState.CONFIRMED && (
          <Button
            className="bg-white text-orange hover:bg-grey-100 mb-6 mr-4"
            data-testid="revoke-another-button"
            onClick={revokeAnotherDocument}
          >
            Revoke another document
          </Button>
        )}
      </div>
      <div className="bg-grey-100 py-6 h-full">
        {(pendingRevokeDocuments.length > 0 || revokedDocuments.length > 0) && (
          <div className="container">
            <div className="border-b border-solid border-grey-200 flex items-center">
              <div
                className="text-grey font-medium text-lg mb-4 flex-grow py-3"
                data-testid="total-number-of-documents"
              >
                {revokedDocuments.length + pendingRevokeDocuments.length} Document(s)
              </div>
            </div>
            <div className="flex flex-wrap border-b border-solid border-grey-200 pb-4 mb-4">
              {revokedDocuments.map((doc, index) => (
                <RevokeTag doc={doc} key={index} isPending={false} fileName={fileName} />
              ))}
              {pendingRevokeDocuments.map((doc, index) => (
                <RevokeTag doc={doc} key={index} isPending={true} fileName={fileName} />
              ))}
            </div>
          </div>
        )}
        {allFailedRevokedDocuments && allFailedRevokedDocuments.length > 0 && (
          <div className="container">
            <div className="text-grey font-medium text-lg my-6">
              {allFailedRevokedDocuments.length} Document(s) Failed
            </div>
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
              {allFailedRevokedDocuments.map((doc, index) => {
                const size = prettyBytes(getFileSize(JSON.stringify(doc)));
                return (
                  <div key={index} className="flex items-center" data-testid="failed-document">
                    <div className="font-bold text-grey">
                      {generateFileName({
                        network: config?.network,
                        fileName: fileName,
                        extension: "",
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
                    generateZipFile(failedRevokedDocuments[0].documents);
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
