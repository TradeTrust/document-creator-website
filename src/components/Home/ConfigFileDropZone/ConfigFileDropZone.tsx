import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { ConfigFile } from "../../../types";

interface DropZone {
  onConfigFile: (config: ConfigFile) => void;
}

export const DropZone: FunctionComponent<DropZone> = ({ onConfigFile }) => {
  const [error, setError] = useState(false);
  const onDrop = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      const config = await readFileAsJson<ConfigFile>(file);
      setError(false);
      onConfigFile(config);
    } catch (e) {
      setError(true);
      console.error(e);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input data-testid="config-file-drop-zone" {...getInputProps()} />
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
    </div>
  );
};

interface ConfigFileDropZone {
  onConfigFile: (configFile: ConfigFile) => void;
}

export const ConfigFileDropZone: FunctionComponent<ConfigFileDropZone> = ({ onConfigFile }) => {
  return (
    <>
      <div className="py-3">
        <h1>Upload Configuration File</h1>
      </div>
      <DropZone onConfigFile={onConfigFile} />
    </>
  );
};
