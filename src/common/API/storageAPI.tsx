import axios from "axios";
import { UploadToStorageResponse, WrappedDocument } from "../../types";

interface QueueNumberResponse {
  id: string;
  key: string;
}

export const getQueueNumber = async (network: string): Promise<QueueNumberResponse> => {
  //TODO: replace this hardcoded url with the one in the config.json in another story
  const url = `api${network === "homestead" ? "" : `-${network}`}.tradetrust.io/storage/queue`;

  try {
    const response = await axios({
      method: "get",
      url: `https://${url}`,
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

export const uploadToStorage = async (
  network: string,
  docData: WrappedDocument
): Promise<UploadToStorageResponse> => {
  //TODO: replace this hardcoded url with the one in the config.json in another story
  const url = `api${network === "homestead" ? "" : `-${network}`}.tradetrust.io/storage`;
  const res = {
    success: false,
    errorMsg: "",
  };

  try {
    await axios({
      method: "post",
      url: `https://${url}/${docData.rawDocument.queueNumber.id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        document: docData.wrappedDocument,
      },
    });
    res.success = true;
    return res;
  } catch (e) {
    res.errorMsg = `There seem to be an error uploading ${docData.fileName} to storeage`;
    return res;
  }
};
