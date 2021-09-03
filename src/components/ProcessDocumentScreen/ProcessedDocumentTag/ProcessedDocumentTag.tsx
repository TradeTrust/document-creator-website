import { LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import { saveAs } from "file-saver";
import prettyBytes from "pretty-bytes";
import { FunctionComponent } from "react";
import { useConfigContext } from "../../../common/context/config";
import { QueueType } from "../../../constants/QueueState";
import { WrappedDocument } from "../../../types";
import { generateFileName, getFileSize } from "../../../utils";

interface PublishedTagProps {
  doc: WrappedDocument;
  isPending: boolean;
  type: QueueType;
  fileName?: string;
}

export const ProcessedDocumentTag: FunctionComponent<PublishedTagProps> = ({ doc, isPending, type, fileName }) => {
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
    <div className="mt-4 flex rounded bg-white p-3 min-w-xs max-w-xs border border-solid border-cloud-200 mr-4 items-center">
      <>
        {isPending ? (
          <LoaderSpinner
            className="mr-4 flex-shrink-0"
            data-testid="processing-loader"
            width="48px"
            primary="#3B8CC5"
          />
        ) : (
          <div className="bg-cerulean w-12 h-12 rounded-full mr-4 flex-shrink-0">
            <div className="flex justify-center items-center h-full text-white font-bold">TT</div>
          </div>
        )}
        <div className="w-auto">
          <div className="font-bold text-cloud-500" data-testid="file-name">
            {documentName}
            <span className="text-cloud-300 text-xs font-regular"> ({size})</span>
          </div>
          {isIssuingFlow && !isPending && (
            <div
              className="text-cerulean font-bold cursor-pointer"
              data-testid="download-file-button"
              onClick={() => saveAs(blob, documentName)}
            >
              Download
            </div>
          )}
        </div>
      </>
    </div>
  );
};
