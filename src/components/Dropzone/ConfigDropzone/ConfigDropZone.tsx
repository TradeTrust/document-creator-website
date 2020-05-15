import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../common/utils";

interface ConfigView {
  isDragActive: boolean;
  error?: boolean;
}

const ConfigView: FunctionComponent<ConfigView> = ({ error, isDragActive }) => {
  return (
    <div
      className={`text-center w-100 border-dashed border-2 border-gray-600 p-3 ${
        isDragActive ? "bg-gray-400" : "bg-white"
      }`}
    >
      {error && <div>Error: File cannot be read</div>}
      <div>Drag and drop file here</div>
      <div>or</div>
      <div>Browse File</div>
    </div>
  );
};

interface ConfigDropZone {
  onConfig: (config: any) => void;
}

export const ConfigDropZone: FunctionComponent<ConfigDropZone> = ({ onConfig }) => {
  const [error, setError] = useState(false);
  const onDrop = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      const config = await readFileAsJson<any>(file);
      setError(false);
      onConfig(config);
    } catch (e) {
      setError(true);
      console.error(e);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <ConfigView isDragActive={isDragActive} error={error} />
    </div>
  );
};
