import React, { ChangeEvent, FunctionComponent, useState } from "react";
import { WidgetProps } from "@rjsf/core";
import { Download } from "react-feather";

export const CustomFileWidget: FunctionComponent<WidgetProps> = ({
  id,
  autofocus,
  multiple,
  disabled,
  readonly,
  options,
  onChange,
}) => {
  interface fileData {
    dataURL: string;
    name: string;
    size: number;
    type: string;
  }

  const [filesMetadata, setFilesMetadata] = useState<any[]>([]);

  function processFile(file: File): Promise<fileData | DOMException> {
    const { name, size, type } = file;
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.onerror = () => {
        reject(reader.error ?? "");
      };

      reader.onload = (event) => {
        resolve({
          dataURL: event?.target?.result,
          name,
          size,
          type,
        } as fileData);
      };
      reader.readAsDataURL(file);
    });
  }

  function processFiles(files: FileList): Promise<any[]> {
    return Promise.all([].map.call(files, processFile));
  }

  const FilesInfo = () => {
    if (filesMetadata.length === 0) {
      return null;
    }

    return (
      <ul className="file-info">
        {filesMetadata.map((info: any, key: number) => {
          const { name, size, type } = info;
          return (
            <li key={key}>
              <strong>{name}</strong> ({type}, {size} bytes)
            </li>
          );
        })}
      </ul>
    );
  };

  const _onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesInfo = await processFiles(event.target.files);
      setFilesMetadata(filesInfo);
      if (multiple) {
        return onChange(filesInfo.map((fileInfo) => fileInfo.dataURL));
      } else {
        return onChange(filesInfo[0].dataURL);
      }
    }
  };

  return (
    <label>
      <div className="cursor-pointer w-max px-4 py-2 border border-gray-300 rounded-lg mt-3 hover:bg-cloud-100">
        <Download className="inline mr-4 text-blue-800" />
        <p className="inline text-blue-800 font-medium">{options.text ?? "Upload Button"}</p>
      </div>
      <FilesInfo />
      <input
        id={id}
        className="hidden"
        type="file"
        onChange={_onChange}
        disabled={readonly || disabled}
        defaultValue=""
        autoFocus={autofocus}
        multiple={multiple}
        accept={(options.accept as string) ?? undefined}
      />
    </label>
  );
};
