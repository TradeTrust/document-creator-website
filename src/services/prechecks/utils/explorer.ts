import axios, { AxiosResponse } from "axios";
import { getEtherscanNetworkApiDetails } from "../../../config";
import { ChainInfoObject } from "../../../constants/chainInfo";
interface ExplorerHeaders {
  "Content-Type": string;
}

interface ExploreParams {
  module: string;
  action: string;
  address: string;
  startblock: string;
  endblock: string;
  page: string;
  offset: string;
  sort: string;
  apikey: string;
}
interface SimplifiedResponse {
  status: number;
  reason: string;
  address: string;
}

const getHeaders = (): ExplorerHeaders => {
  const headers = {
    "Content-Type": "application/json",
  } as ExplorerHeaders;

  return headers;
};

const getParams = (contractAddress: string, apiKey: string): ExploreParams => {
  const headers = {
    module: "account",
    action: "txlist",
    startblock: "0",
    endblock: "99999999",
    page: "1",
    offset: "1",
    sort: "asc",
  } as ExploreParams;

  if (apiKey) {
    headers["apikey"] = apiKey;
  }

  if (contractAddress) {
    headers["address"] = contractAddress;
  }

  return headers;
};

export const getCreationAddressRequest = async (
  contractAddress: string,
  chainInfo: ChainInfoObject,
  apiKey?: string
): Promise<AxiosResponse> => {
  const networkApiDetails = getEtherscanNetworkApiDetails(chainInfo);
  const url = `${networkApiDetails.hostname}/api`;

  if (apiKey === undefined) {
    apiKey = networkApiDetails.apiKey;
  }

  return axios({
    method: "get",
    url: url,
    headers: getHeaders(),
    params: getParams(contractAddress, apiKey),
  });
};

const sendCreationAddressRequest = async (
  contractAddress: string,
  chainInfo: ChainInfoObject,
  apiKey?: string
): Promise<SimplifiedResponse> => {
  const response = await getCreationAddressRequest(contractAddress, chainInfo, apiKey);
  const responseStatus = response.data?.status?.toString?.();
  const responseMessage = response.data?.message?.toString?.();
  if (responseStatus === "0") {
    if (responseMessage === "No transactions found") {
      const noTransactionResponse = {
        status: 2,
        reason: "No Transaction Found",
      } as SimplifiedResponse;
      return noTransactionResponse;
    }
  } else if (responseStatus === "1") {
    const successResponse = {
      status: 0,
      reason: "Call Successful",
      address: response.data?.result?.[0]?.from,
    } as SimplifiedResponse;
    return successResponse;
  }
  return {
    status: 1,
    reason: "Call Failed",
  } as SimplifiedResponse;
};

export const getCreationAddress = async (
  contractAddress: string,
  chainInfo: ChainInfoObject,
  apiKey?: string
): Promise<string> => {
  return await (
    await sendCreationAddressRequest(contractAddress, chainInfo, apiKey)
  ).address;
};

export const checkCreationAddress = async ({
  contractAddress,
  network,
  userAddress,
  strict,
  apiKey,
}: {
  contractAddress: string;
  network: ChainInfoObject;
  userAddress: string;
  strict: boolean;
  apiKey?: string;
}): Promise<boolean> => {
  const simplifiedResponse = await sendCreationAddressRequest(contractAddress, network, apiKey);
  if (simplifiedResponse.status === 0) {
    return simplifiedResponse.address.toLowerCase() === userAddress.toLowerCase();
  } else if (simplifiedResponse.status === 1) {
    return !strict;
  }
  return false;
};
