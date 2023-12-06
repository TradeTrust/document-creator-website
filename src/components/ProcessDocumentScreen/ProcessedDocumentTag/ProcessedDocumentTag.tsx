import { LoaderSpinner } from "@tradetrust-tt/tradetrust-ui-components";
import { saveAs } from "file-saver";
import prettyBytes from "pretty-bytes";
import { FunctionComponent } from "react";
import { XCircle } from "react-feather";
import { useConfigContext } from "../../../common/context/config";
import { QueueType } from "../../../constants/QueueState";
import { WrappedDocument } from "../../../types";
import { generateFileName, getFileSize } from "../../../utils";
import { primary } from "../../../constants/styles";

interface PublishedTagProps {
  doc: WrappedDocument;
  isPending: boolean;
  type: QueueType;
  fileName?: string;
  isError?: boolean;
  hideAction?: boolean;
}

export const ProcessedDocumentTag: FunctionComponent<PublishedTagProps> = ({
  doc,
  isPending,
  type,
  fileName,
  isError = false,
  hideAction = false,
}) => {
  const { config } = useConfigContext();
  const isIssuingFlow = type === QueueType.ISSUE;
  const file = JSON.stringify(isIssuingFlow ? doc.wrappedDocument : doc);
  const size = prettyBytes(getFileSize(file));
  const blob = new Blob([file], { type: "text/json;charset=utf-8" });
  const documentName = isIssuingFlow
    ? generateFileName({
        network: config?.network,
        fileName: doc.fileName,
        extension: doc.extension,
      })
    : fileName;
  return (
    <div className="my-4 flex rounded-lg bg-white p-3 min-w-xs max-w-xs border border-solid border-cloud-200 mr-4 items-center">
      <>
        {isPending ? (
          <LoaderSpinner
            className="mr-4 flex-shrink-0"
            data-testid="processing-loader"
            width="48px"
            primary={primary}
          />
        ) : isError ? (
          <XCircle className="mr-4 text-scarlet-500 h-12 w-12" />
        ) : (
          <div className="bg-cerulean-500 w-12 h-12 rounded-full mr-4 flex-shrink-0">
            <div className="flex justify-center items-center h-full text-white">TT</div>
          </div>
        )}
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-cloud-800" data-testid="file-name">
                {documentName}
              </div>
              {!hideAction && !isPending && (
                <>
                  {isIssuingFlow ? (
                    !isError && (
                      <div
                        className="text-cerulean-300 cursor-pointer hover:text-cerulean-500"
                        data-testid="download-file-button"
                        onClick={() => saveAs(blob, documentName)}
                      >
                        Download
                      </div>
                    )
                  ) : (
                    <h6 className="text-scarlet-500">Revoked</h6>
                  )}
                </>
              )}
            </div>
            <div className="text-cloud-300 font-regular whitespace-nowrap"> ({size})</div>
          </div>
        </div>
      </>
    </div>
  );
};
