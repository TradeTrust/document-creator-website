import { saveAs } from "file-saver";
import prettyBytes from "pretty-bytes";
import React, { FunctionComponent } from "react";
import { WrappedDocument } from "../../../../types";

interface PublishedTagProps {
  doc: WrappedDocument;
}

const getFileSize = (jsonString: string): number => {
  const m = encodeURIComponent(jsonString).match(/%[89ABab]/g);
  return jsonString.length + (m ? m.length : 0);
};

export const PublishedTag: FunctionComponent<PublishedTagProps> = ({ doc }) => {
  const file = JSON.stringify(doc.wrappedDocument);
  const size = prettyBytes(getFileSize(file));
  const blob = new Blob([file], { type: "text/json;charset=utf-8" });
  return (
    <div className="mt-4 flex rounded bg-white p-3 w-72 border border-solid border-lightgrey mr-4">
      <div className="rounded-full bg-blue mr-4 w-12 h-12 text-white font-bold flex justify-center items-center">
        TT
      </div>
      <div className="flex flex-col">
        <div className="font-bold text-lightgrey-dark">
          {doc.fileName}.tt
          <span className="text-lightgrey-dark text-xs font-regular"> ({size})</span>
        </div>
        <div
          className="text-blue font-bold cursor-pointer"
          data-testid="download-file-button"
          onClick={() => saveAs(blob, doc.fileName)}
        >
          Download
        </div>
      </div>
    </div>
  );
};
