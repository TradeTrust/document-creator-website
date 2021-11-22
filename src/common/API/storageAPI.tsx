import { utils } from "@govtechsg/open-attestation";
import axios, { AxiosResponse } from "axios";
import { DocumentStorage, WrappedDocument } from "../../types";
import { decodeQrCode } from "../utils";

interface Headers {
  "Content-Type": string;
  "x-api-key": string;
}

const getHeaders = (documentStorage: DocumentStorage): Headers => {
  const headers = {
    "Content-Type": "application/json",
  } as Headers;

  const apiKey = "x-api-key";

  if (documentStorage.apiKey) headers[apiKey] = documentStorage.apiKey;

  return headers;
};

export const getQueueNumber = async (documentStorage: DocumentStorage): Promise<AxiosResponse> => {
  const url = `${documentStorage.url}/queue`;

  return axios({
    method: "get",
    url: url,
    headers: getHeaders(documentStorage),
  });
};

export const uploadToStorage = async (
  doc: WrappedDocument,
  documentStorage: DocumentStorage
): Promise<AxiosResponse> => {
  const { links } = utils.isRawV3Document(doc.rawDocument) ? doc.rawDocument.credentialSubject : doc.rawDocument;
  const qrCodeObj = decodeQrCode(links.self.href);
  const uri = qrCodeObj.payload.uri;

  return axios({
    method: "post",
    url: uri,
    headers: getHeaders(documentStorage),
    data: {
      document: doc.wrappedDocument,
    },
  });
};
