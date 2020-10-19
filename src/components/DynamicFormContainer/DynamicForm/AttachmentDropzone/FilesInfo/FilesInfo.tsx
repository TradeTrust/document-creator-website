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

export const getExtension = (fileType: string): { hasIcon: boolean; fileType: string } => {
  const iconName = fileType.split("/")[1] || "";
  console.log("fileType: ", fileType);
  if (iconName == "pdf") return { hasIcon: true, fileType: pdf };
  else if (iconName === "jpeg") return { hasIcon: true, fileType: jpg };
  else if (iconName === "vnd.openxmlformats-officedocument.wordprocessingml.document")
    return { hasIcon: true, fileType: doc };
  else if (iconName === "csv") return { hasIcon: true, fileType: csv };
  else if (iconName === "png") return { hasIcon: true, fileType: png };
  else if (iconName === "plain") return { hasIcon: true, fileType: txt };
  else return { hasIcon: false, fileType: iconName };
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
        const { hasIcon, fileType } = getExtension(type);
        return (
          <li
            key={key}
            data-testid={`upload-file-${key}`}
            className="border border-grey-lighter border-solid rounded my-1 h-16 flex items-center px-4"
          >
            {hasIcon ? (
              <img
                src={fileType}
                className="flex items-center justify-center mr-4"
                data-testid="link-icon"
              />
            ) : (
              <div
                className="rounded-full bg-grey-lighter h-12 w-12 flex items-center justify-center mr-2"
                data-testid={`attachment-icon-${key}`}
              >
                <Paperclip />
              </div>
            )}
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
