import { WrappedDocument } from "../types";
import { saveAs } from "file-saver";
import JSZip from "jszip";

interface generateFileNameI {
  network?: string;
  fileName: string;
  extension: string;
  hasTimestamp?: boolean;
}

export const generateFileName = ({ network, fileName, extension, hasTimestamp }: generateFileNameI): string => {
  const timestamp = new Date().toISOString();
  const fileNetwork = network === "homestead" ? "" : `-${network}`;
  const fileTimestamp = hasTimestamp ? `-${timestamp}` : "";
  return `${fileName}${fileNetwork}${fileTimestamp}.${extension}`;
};

export const generateZipFile = (documents: WrappedDocument[], network: string | undefined = ""): void => {
  const zip = new JSZip();
  documents.forEach((document) => {
    const file = JSON.stringify(document.wrappedDocument, null, 2);
    const blob = new Blob([file], { type: "text/json;charset=utf-8" });

    zip.file(
      generateFileName({
        network: network,
        fileName: document.fileName,
        extension: document.extension,
      }),
      blob
    );
  });

  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(
      content,
      generateFileName({
        network: network,
        fileName: "Documents",
        extension: "zip",
        hasTimestamp: true,
      })
    );
  });
};

export const getFileSize = (jsonString: string): number => {
  const m = encodeURIComponent(jsonString).match(/%[89ABab]/g);
  return jsonString.length + (m ? m.length : 0);
};
