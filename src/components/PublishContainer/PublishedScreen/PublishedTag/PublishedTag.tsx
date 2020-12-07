import { saveAs } from "file-saver";
import prettyBytes from "pretty-bytes";
import React, { FunctionComponent } from "react";
import { useConfigContext } from "../../../../common/context/config";
import { WrappedDocument } from "../../../../types";
import { generateFileName } from "../../../../utils/fileName";
import { PublishLoader } from "../../../UI/PublishLoader";

interface PublishedTagProps {
  doc: WrappedDocument;
  isPending: boolean;
}

const getFileSize = (jsonString: string): number => {
  const m = encodeURIComponent(jsonString).match(/%[89ABab]/g);
  return jsonString.length + (m ? m.length : 0);
};

export const PublishedTag: FunctionComponent<PublishedTagProps> = ({ doc, isPending }) => {
  const { config } = useConfigContext();
  const file = JSON.stringify(doc.wrappedDocument);
  const size = prettyBytes(getFileSize(file));
  const blob = new Blob([file], { type: "text/json;charset=utf-8" });
  const fileName = generateFileName({
    network: config?.network,
    fileName: doc.fileName,
    extension: "tt",
  });
  return (
    <div className="mt-4 flex rounded bg-white p-3 min-w-xs max-w-xs border border-solid border-grey-200 mr-4 items-center">
      {isPending ? (
        <>
          <div className="h-12 w-12 mr-4" data-testid="publish-loader">
            <PublishLoader />
          </div>
          <div className="font-bold text-grey">
            {fileName}
            <span className="text-grey-400 text-xs font-regular"> ({size})</span>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-full bg-blue mr-4 w-12 h-12 text-white font-bold flex justify-center items-center">
            TT
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-grey">
              {fileName}
              <span className="text-grey-400 text-xs font-regular"> ({size})</span>
            </div>
            <div
              className="text-blue font-bold cursor-pointer"
              data-testid="download-file-button"
              onClick={() => saveAs(blob, fileName)}
            >
              Download
            </div>
          </div>
        </>
      )}
    </div>
  );
};
