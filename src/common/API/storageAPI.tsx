import axios, { AxiosResponse } from "axios";
import { DocumentStorage, WrappedDocument } from "../../types";
import { decodeQrCode } from "../utils";

export const getQueueNumber = async (documentStorage: DocumentStorage): Promise<AxiosResponse> => {
  const url = `${documentStorage.url}/queue`;

  return axios({
    method: "get",
    url: url,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": documentStorage.apiKey,
    },
  });
};

export const uploadToStorage = async (
  doc: WrappedDocument,
  documentStorage: DocumentStorage | undefined
): Promise<AxiosResponse> => {
  const qrCodeObj = decodeQrCode(doc.rawDocument.links.self.href);
  const uri = qrCodeObj.payload.uri;

  return axios({
    method: "post",
    url: uri,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": documentStorage?.apiKey,
    },
    data: {
      document: doc.wrappedDocument,
    },
  });
};
