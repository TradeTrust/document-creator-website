import { ChainInfoObject } from "../constants/chainInfo";

export const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "6028cd7708c54c91a90df6cefd9bf1a9"; // TODO: inject project id into env variable

export const ETHERSCAN_API_KEY = {
  ETH: process.env.REACT_APP_API_KEY_ETH,
  MATIC: process.env.REACT_APP_API_KEY_MATIC,
};

export const STABILITY_API_KEY = process.env.REACT_APP_STABILITY_API_KEY;
export const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY;

export interface EtherscanNetworkApiDetails {
  apiKey: string;
  hostname: string;
}

export const getEtherscanNetworkApiDetails = (chainInfo: ChainInfoObject): EtherscanNetworkApiDetails => {
  const apiKey = (ETHERSCAN_API_KEY as any)[chainInfo.chain];
  return { hostname: chainInfo.explorerApiUrl, apiKey: apiKey } as EtherscanNetworkApiDetails;
};
