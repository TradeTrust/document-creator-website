import { ChainInfoObject } from "../constants/chainInfo";

export const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "6028cd7708c54c91a90df6cefd9bf1a9"; // TODO: inject project id into env variable

export const ETHERSCAN_API_KEY = {
  ETH: process.env.REACT_APP_API_KEY_ETH || "XWKZFH99X5M1ESC6QC5YK26RRK8K9P3W9K",
  MATIC: process.env.REACT_APP_API_KEY_MATIC || "RPFRR1C1XI7K2D3ZEZXT2VY9GNJPNUQ3Z3",
};

export interface EtherscanNetworkApiDetails {
  apiKey: string;
  hostname: string;
}

export const getEtherscanNetworkApiDetails = (chainInfo: ChainInfoObject): EtherscanNetworkApiDetails => {
  const apiKey = (ETHERSCAN_API_KEY as any)[chainInfo.chain];
  return { hostname: chainInfo.explorerApiUrl, apiKey: apiKey } as EtherscanNetworkApiDetails;
};
