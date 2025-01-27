import { utils } from "@tradetrust-tt/tradetrust";
import axios, { AxiosResponse, AxiosHeaders } from "axios";
import { DocumentStorage, WrappedDocument } from "../../types";
import { decodeQrCode } from "../utils";

// Function to get the CSRF token from /csrf-token route
const fetchCsrfToken = async (): Promise<string> => {
  try {
    const response = await axios.get("/csrf-token"); // Send GET request to get CSRF token
    console.log('response', response);
    const csrfToken = response.data.body.csrfToken; // Assuming the server sends the CSRF token in the response body
    if (!csrfToken) {
      throw new Error("CSRF token not found in response");
    }
    return csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token", error);
    throw error; // Rethrow or handle as needed
  }
};

const getHeaders = (documentStorage: DocumentStorage, csrfToken?: string): AxiosHeaders => {
  const headers = new AxiosHeaders({
    "Content-Type": "application/json",
  });

  const xApiKey = "x-api-key";

  if (documentStorage.apiKey) {
    const apiKey = process.env.REACT_APP_API_KEY_DOCUMENT_STORAGE
      ? process.env.REACT_APP_API_KEY_DOCUMENT_STORAGE
      : documentStorage.apiKey;
    headers.set(xApiKey, apiKey);
  }

  if (csrfToken) {
    headers.set("X-CSRF-Token", csrfToken); // Set CSRF token if passed
  }

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

  const csrfToken = await fetchCsrfToken(); // Fetch the CSRF token
  return axios({
    method: "post",
    url: uri,
    headers: getHeaders(documentStorage, csrfToken), // Add CSRF token to headers
    data: {
      document: doc.wrappedDocument,
    },
  });
};
