import prettyBytes from "pretty-bytes";
import React, { FunctionComponent } from "react";
import { FileUploadType } from "../../../../../types";
import { Paperclip, X } from "react-feather";

interface FilesInfoType {
  filesInfo: FileUploadType[];
  removeFile: (index: number) => void;
}

interface ExtensionIconProps {
  src: string;
}

const ExtensionIcon: FunctionComponent<ExtensionIconProps> = ({ ...props }) => {
  return <img {...props} className="flex items-center justify-center mr-2" />;
};

export const getExtension = (mimeType: string | undefined): React.ReactNode => {
  switch (true) {
    case mimeType === "text/csv":
      return <ExtensionIcon src="./csv.svg" data-testid="attachment-icon-csv" />;
    case mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword":
      return <ExtensionIcon src="./doc.svg" data-testid="attachment-icon-doc" />;
    case mimeType === "image/jpeg":
      return <ExtensionIcon src="./jpg.svg" data-testid="attachment-icon-jpg" />;
    case mimeType === "image/png":
      return <ExtensionIcon src="./png.svg" data-testid="attachment-icon-png" />;
    case mimeType === "application/pdf":
      return <ExtensionIcon src="./pdf.svg" data-testid="attachment-icon-pdf" />;
    case mimeType === "text/plain":
      return <ExtensionIcon src="./txt.svg" data-testid="attachment-icon-txt" />;
    default:
      return (
        <div className="icon" data-testid={`attachment-icon-paperclip`}>
          <Paperclip />
        </div>
      );
  }
};

export const FilesInfo: FunctionComponent<FilesInfoType> = ({ filesInfo, removeFile }) => {
  if (!filesInfo || filesInfo.length === 0) {
    return null;
  }
  return (
    <ul className="file-info mt-4">
      {filesInfo.map(({ filename, data, type }: FileUploadType, key: number) => {
        const decodedData = atob(data);
        const size = prettyBytes(decodedData.length);
        return (
          <li
            key={key}
            data-testid={`upload-file-${key}`}
            className="border border-grey-lighter border-solid rounded my-1 h-16 flex items-center px-4"
          >
            {getExtension(type)}
            <p className="font-bold text-grey-dark flex-grow break-all">
              {filename}
              <span className="text-grey text-xs font-regular"> ({size})</span>
            </p>

            <div
              className="cursor-pointer"
              data-testid={`remove-uploaded-file-${key}`}
              onClick={() => {
                removeFile(key);
              }}
            >
              <X />
            </div>
          </li>
        );
      })}
    </ul>
  );
};
