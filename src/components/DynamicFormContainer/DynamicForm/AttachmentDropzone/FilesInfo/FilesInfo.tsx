import prettyBytes from "pretty-bytes";
import React, { FunctionComponent } from "react";
import { FileUploadType } from "../../../../../types";
import { Paperclip, X } from "react-feather";
import pdf from "./pdf.svg";
import jpg from "./jpg.svg";
import doc from "./doc.svg";
import csv from "./csv.svg";
import png from "./png.svg";
import txt from "./txt.svg";

interface FilesInfoType {
  filesInfo: FileUploadType[];
  removeFile: (index: number) => void;
}

interface ExtensionIconProps {
  src: string;
  mimetype: string;
}

const ExtensionIcon: FunctionComponent<ExtensionIconProps> = ({
  src,
  mimetype,
}: ExtensionIconProps) => {
  return (
    <img
      src={src}
      className="flex items-center justify-center mr-4"
      data-testid={`attachment-icon-${mimetype}`}
    />
  );
};

export const getExtension = (mimeType: string): React.ReactNode => {
  switch (true) {
    case mimeType === "text/csv":
      return <ExtensionIcon src={csv} mimetype={mimeType} />;
    case mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <ExtensionIcon src={doc} mimetype={mimeType} />;
    case mimeType === "image/jpeg":
      return <ExtensionIcon src={jpg} mimetype={mimeType} />;
    case mimeType === "image/png":
      return <ExtensionIcon src={png} mimetype={mimeType} />;
    case mimeType === "application/pdf":
      return <ExtensionIcon src={pdf} mimetype={mimeType} />;
    case mimeType === "text/plain":
      return <ExtensionIcon src={txt} mimetype={mimeType} />;
    default:
      return (
        <div
          className="rounded-full bg-grey-lighter h-12 w-12 flex items-center justify-center mr-2"
          data-testid={`attachment-icon-paperclip`}
        >
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
            <p className="font-bold text-grey-dark flex-grow">
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
