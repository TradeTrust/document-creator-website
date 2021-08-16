import { LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import prettyBytes from "pretty-bytes";
import { FunctionComponent } from "react";
import { getFileSize } from "../../../utils";

interface RevokeTagProps {
  doc: any;
  isPending: boolean;
  fileName: string;
}

export const RevokeTag: FunctionComponent<RevokeTagProps> = ({ doc, isPending, fileName }) => {
  const file = JSON.stringify(doc);
  const size = prettyBytes(getFileSize(file));
  return (
    <div className="mt-4 flex rounded bg-white p-3 min-w-xs max-w-xs border border-solid border-grey-200 mr-4 items-center">
      <>
        {isPending ? (
          <LoaderSpinner
            className="mr-4 flex-shrink-0"
            data-testid="loader-spinner"
            width="48px"
            primary="#00cbbc"
            secondary="#e2e8f0"
          />
        ) : (
          <div className="bg-blue w-12 h-12 rounded-full mr-4 flex-shrink-0">
            <div className="flex justify-center items-center h-full text-white font-bold">TT</div>
          </div>
        )}
        <div className="w-auto">
          <div className="font-bold text-grey" data-testid="file-name">
            {fileName}
            <span className="text-grey-400 text-xs font-regular"> ({size})</span>
          </div>
        </div>
      </>
    </div>
  );
};
