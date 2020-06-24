import prettyBytes from "pretty-bytes";
import React, { FunctionComponent } from "react";
import { FileUploadType } from "../../../../../types";
import { SvgIcon, SvgIconPaperClip, SvgIconX } from "../../../../../UI/SvgIcon";

interface FilesInfoType {
  filesInfo: FileUploadType[];
  removeFile: (index: number) => void;
}

export const FilesInfo: FunctionComponent<FilesInfoType> = ({ filesInfo, removeFile }) => {
  if (!filesInfo || filesInfo.length === 0) {
    return null;
  }
  return (
    <ul className="file-info mt-4">
      {filesInfo.map(({ filename, size }: FileUploadType, key: number) => {
        return (
          <li
            key={key}
            data-testid={`upload-file-${key}`}
            className="border border-grey-lighter border-solid rounded my-1 h-16 flex items-center px-4"
          >
            <div
              className="rounded-full bg-grey-lighter h-12 w-12 flex items-center justify-center mr-2"
              data-testid={`attachment-icon-${key}`}
            >
              <SvgIcon>
                <SvgIconPaperClip />
              </SvgIcon>
            </div>

            <p className="font-bold text-grey-dark flex-grow">
              {filename}
              <span className="text-grey text-xs font-regular"> ({prettyBytes(size)})</span>
            </p>

            <div
              className="cursor-pointer"
              data-testid={`remove-uploaded-file-${key}`}
              onClick={() => {
                removeFile(key);
              }}
            >
              <SvgIcon>
                <SvgIconX />
              </SvgIcon>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
