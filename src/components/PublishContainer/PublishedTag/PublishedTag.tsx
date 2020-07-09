import prettyBytes from "pretty-bytes";
import React, { FunctionComponent } from "react";
import { WrappedDocument } from "../../../types";

interface PublishedTagProps {
  doc: WrappedDocument;
}

const getFileSize = (jsonString: string): number => {
  const m = encodeURIComponent(jsonString).match(/%[89ABab]/g);
  return jsonString.length + (m ? m.length : 0);
};

export const PublishedTag: FunctionComponent<PublishedTagProps> = ({ doc }) => {
  const size = prettyBytes(getFileSize(JSON.stringify(doc.wrappedDocument)));
  return (
    <div className="mt-4 flex rounded bg-white p-3 w-72 border border-solid border-lightgrey mr-4">
      <div className="rounded-full bg-blue mr-4 w-12 h-12 text-white font-bold flex justify-center items-center">
        TT
      </div>
      <div className="flex flex-col">
        <div className="font-bold text-lightgrey-dark">
          {doc.fileName}
          <span className="text-lightgrey-dark text-xs font-regular"> ({size})</span>
        </div>
        <a
          className="text-blue font-bold"
          href={`data:text/json;charset=utf-8,${JSON.stringify(doc.wrappedDocument)}`}
          download={doc.fileName}
        >
          Download
        </a>
      </div>
    </div>
  );
};
