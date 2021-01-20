import { saveAs } from "file-saver";
import prettyBytes from "pretty-bytes";
import React, { FunctionComponent } from "react";
import { LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import { useConfigContext } from "../../../../common/context/config";
import { WrappedDocument } from "../../../../types";
import { generateFileName } from "../../../../utils/fileName";

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
          <LoaderSpinner
            className="mr-4 flex-shrink-0"
            data-testid="publish-loader"
            width="48px"
            primary="#00cbbc"
            secondary="#e2e8f0"
          />
          <div className="w-auto">
            <div className="font-bold text-grey">
              {fileName}
              <span className="text-grey-400 text-xs font-regular"> ({size})</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-blue w-12 h-12 rounded-full mr-4 flex-shrink-0">
            <div className="flex justify-center items-center h-full text-white font-bold">TT</div>
          </div>
          <div className="w-auto">
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
