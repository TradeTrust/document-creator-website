import axios, { AxiosResponse } from "axios";
import { ETHERSCAN_API_KEY } from "../../../config";
import { NetworkObject } from "../../../types";
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

interface NetworkApiDetails {
  apiKey: string;
  hostname: string;
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

const getNetworkApiDetails = (network: NetworkObject): NetworkApiDetails => {
  // const chain: string = network.network.chain;
  const chainId: number = parseInt(network.network.chainId);
  let url = "";
  let apiKey = "";
  let hostnameNetwork = "";
  let chainType = "";

  if (chainId === 1 || chainId === 3 || chainId === 4 || chainId === 5 || chainId === 42) {
    hostnameNetwork = "";
    chainType = "ETH";
    if (chainId === 3) {
      hostnameNetwork = "-ropsten";
    } else if (chainId === 4) {
      hostnameNetwork = "-rinkeby";
    } else if (chainId === 5) {
      hostnameNetwork = "-goerli";
    } else if (chainId === 42) {
      hostnameNetwork = "-kovan";
    }
    url = `https://api${hostnameNetwork}.etherscan.io`;
  } else if (chainId === 137 || chainId === 80001) {
    hostnameNetwork = "";
    chainType = "MATIC";
    if (chainId === 80001) {
      hostnameNetwork = "-testnet";
    }
    url = `https://api${hostnameNetwork}.polygonscan.com`;
  } else {
    url = `https://api.etherscan.io`;
  }

  apiKey = (ETHERSCAN_API_KEY as any)[chainType];
  return { hostname: url, apiKey: apiKey } as NetworkApiDetails;
};

export const getCreationAddressRequest = async (
  contractAddress: string,
  network: NetworkObject,
  apiKey?: string
): Promise<AxiosResponse> => {
  const networkApiDetails = getNetworkApiDetails(network);
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
  network: NetworkObject,
  apiKey?: string
): Promise<SimplifiedResponse> => {
  // {"status":"0","message":"NOTOK","result":"Max rate limit reached, please use API Key for higher rate limit"}
  // {"status":"1","message":"OK-Missing/Invalid API Key, rate limit of 1/5sec applied"
  // {"status":"0","message":"No transactions found","result":[]}
  let attempts = 3;
  while (attempts > 0) {
    const response = await getCreationAddressRequest(contractAddress, network, apiKey);
    if (response.data === undefined) {
      const simplifiedResponse = {
        status: 1,
        reason: "Call Failed",
      } as SimplifiedResponse;
      return simplifiedResponse;
    } else {
      if (response.data.status.toString() === "0") {
        if (response.data.message.toString() === "No transactions found") {
          const simplifiedResponse = {
            status: 2,
            reason: "No Transaction Found",
          } as SimplifiedResponse;
          return simplifiedResponse;
        }
        // else if(response.data.message.toString() === "NOTOK"){
        //     if(response.data.result.toString() === "Max rate limit reached, please use API Key for higher rate limit"){
        //       // Re-run, rate limit
        //     }
        // }
      } else if (response.data.status.toString() === "1") {
        const simplifiedResponse = {
          status: 0,
          reason: "Call Successful",
          address: response.data?.result[0]?.from,
        } as SimplifiedResponse;
        return simplifiedResponse;
      }
    }
    attempts = attempts - 1;
  }
  const simplifiedResponse = {
    status: 1,
    reason: "Call Failed",
  } as SimplifiedResponse;
  return simplifiedResponse;
};

export const getCreationAddress = async (
  contractAddress: string,
  network: NetworkObject,
  apiKey?: string
): Promise<string> => {
  return await (
    await sendCreationAddressRequest(contractAddress, network, apiKey)
  ).address;
};

export const checkCreationAddress = async (
  contractAddress: string,
  network: NetworkObject,
  ownerAddress: string,
  strict: boolean,
  apiKey?: string
): Promise<boolean> => {
  const simplifiedResponse = await sendCreationAddressRequest(contractAddress, network, apiKey);
  if (simplifiedResponse.status === 0) {
    return simplifiedResponse.address.toLowerCase() === ownerAddress.toLowerCase();
  } else if (simplifiedResponse.status === 1) {
    if (strict) {
      return false;
    } else {
      return true;
    }
  } else if (simplifiedResponse.status === 2) {
    return false;
  } else {
    return false;
  }
};
