import axios, { AxiosResponse } from "axios";
import { QueueNumberResponse, WrappedDocument } from "../../types";
import { decodeQrCode } from "../utils";

export const getQueueNumber = async (storageEndpoint: string): Promise<QueueNumberResponse> => {
  //TODO: replace this hardcoded url with the one in the config.json in another story
  const url = `${storageEndpoint}/queue`;

  try {
    const response = await axios({
      method: "get",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (e) {
    return {
      id: "",
      key: "",
    };
  }
};

export const uploadToStorage = async (doc: WrappedDocument): Promise<AxiosResponse> => {
  const qrCodeObj = decodeQrCode(doc.rawDocument.links.self.href);
  const uri = qrCodeObj.payload.uri;

  return axios({
    method: "post",
    url: uri,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      document: doc.wrappedDocument,
    },
  });
};
