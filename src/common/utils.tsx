import { csv2jsonAsync } from "json-2-csv";
import converter from "json-2-csv";
import { saveAs } from "file-saver";
import { AwsKmwSignerOption } from "../types";

export function readFileAsJson<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();
    if (reader.error) {
      reject(reader.error);
    }
    reader.onload = () => {
      try {
        const json: T = JSON.parse(reader.result as string);
        resolve(json);
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(file);
  });
}

export function readFileAsCsv(file: File): Promise<Array<JSON>> {
  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();
    if (reader.error) {
      reject(reader.error);
    }
    reader.onload = async () => {
      const data: JSON[] = await csv2jsonAsync(reader.result as string);
      resolve(data);
    };
    reader.readAsText(file);
  });
}

interface QrCode {
  type: string;
  payload: {
    uri: string;
    key: string;
    permittedActions: string[];
    redirect: string;
  };
}

export const encodeQrCode = (payload: QrCode): string =>
  `https://action.openattestation.com?q=${encodeURIComponent(JSON.stringify(payload))}`;

export const decodeQrCode = (qrCode: string): QrCode => {
  const ttRegex = /https:\/\/action.openattestation.com\/?\?q=(.*)/;
  if (!ttRegex.test(qrCode)) throw new Error("QR Code is not formatted to TradeTrust specifications");
  const matchedArray = ttRegex.exec(qrCode) as RegExpExecArray;
  const encodedPayload = matchedArray[1];
  const decodedPayload = JSON.parse(decodeURIComponent(encodedPayload));
  return decodedPayload;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const downloadCsvDataFile = (jsonTemplate: any): void => {
  converter.json2csv(jsonTemplate, (err, csv) => {
    if (err) {
      throw err;
    }
    if (!csv) {
      throw new Error("There seem to be an error in the CSV data file you are downloading, please try again later.");
    }

    const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8" });

    saveAs(csvBlob, "sample-data.csv");
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const downloadJsonDataFile = (jsonTemplate: any): void => {
  const jsonData = JSON.stringify({ data: jsonTemplate });

  const jsonBlob = new Blob([jsonData], { type: "text/json;charset=utf-8" });
  saveAs(jsonBlob, "sample-data.json");
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isAwsKmsSignerOption = (option: any): option is AwsKmwSignerOption => {
  return (
    typeof option?.accessKeyId === "string" &&
    typeof option?.region === "string" &&
    typeof option?.kmsKeyId === "string"
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isWalletOption = (option: any): option is string => {
  return typeof option === "string";
};
