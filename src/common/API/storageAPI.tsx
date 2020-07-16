import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getQueueNumber = async (network: string): Promise<any> => {
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
    return {};
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uploadToStorage = async (network: string, docData: any): Promise<any> => {
  const url = `api${network === "homestead" ? "" : `-${network}`}.tradetrust.io/storage`;
  try {
    const response = await axios({
      method: "post",
      url: `https://${url}/${docData.rawDocument.queueNumber.id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        document: docData.wrappedDocument,
      },
    });
    return response;
  } catch (e) {
    return {};
  }
};
