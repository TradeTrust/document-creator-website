import { Network } from "../types";
export interface ChainInfoObject {
  label: string;
  chain: string;
  chainId: ChainId;
  networkName: Network; // network name that aligns with existing NETWORK_NAME
  explorerUrl: string;
  explorerApiUrl?: string;
  rpcUrl?: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

type ChainInfo = Record<ChainId, ChainInfoObject>;

export enum ChainId {
  // Localhost
  Local = 1337,

  // Ethereum Mainnet
  Ethereum = 1,

  // Ethereum Testnet
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Sepolia = 11155111,

  // Polygon
  Polygon = 137,
  PolygonMumbai = 80001,
}

export const ChainInfo: ChainInfo = {
  [ChainId.Local]: {
    label: "Local",
    chain: "ETH",
    chainId: ChainId.Local,
    networkName: "local",
    explorerUrl: "https://localhost/explorer",
    explorerApiUrl: "NIL",
    // Is there a api for the ganache or sth
  },
  [ChainId.Ethereum]: {
    label: "Ethereum",
    chain: "ETH",
    chainId: ChainId.Ethereum,
    networkName: "homestead",
    explorerUrl: "https://etherscan.io",
    explorerApiUrl: "https://api.etherscan.io",
  },
  [ChainId.Ropsten]: {
    label: "Ropsten",
    chain: "ETH",
    chainId: ChainId.Ropsten,
    networkName: "ropsten",
    explorerUrl: "https://ropsten.etherscan.io",
    explorerApiUrl: "https://api-ropsten.etherscan.io",
  },
  [ChainId.Rinkeby]: {
    label: "Rinkeby",
    chain: "ETH",
    chainId: ChainId.Rinkeby,
    networkName: "rinkeby",
    explorerUrl: "https://rinkeby.etherscan.io",
    explorerApiUrl: "https://api-rinkeby.etherscan.io",
    rpcUrl: "https://eth-rinkeby-rpc.gateway.pokt.network",
  },
  [ChainId.Goerli]: {
    label: "Goerli",
    chain: "ETH",
    chainId: ChainId.Goerli,
    networkName: "goerli",
    explorerUrl: "https://goerli.etherscan.io",
    explorerApiUrl: "https://api-goerli.etherscan.io",
  },
  [ChainId.Sepolia]: {
    label: "Sepolia",
    chain: "ETH",
    chainId: ChainId.Sepolia,
    networkName: "sepolia",
    explorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://rpc.sepolia.org",
    nativeCurrency: {
      name: "ETH",
      symbol: "sepETH",
      decimals: 18,
    },
  },
  [ChainId.Polygon]: {
    label: "Polygon (Beta)",
    chain: "MATIC",
    chainId: ChainId.Polygon,
    networkName: "matic",
    explorerUrl: "https://polygonscan.com",
    explorerApiUrl: "https://api.polygonscan.com",
    rpcUrl: "https://polygon-rpc.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  [ChainId.PolygonMumbai]: {
    label: "Polygon Mumbai",
    chain: "MATIC",
    chainId: ChainId.PolygonMumbai,
    networkName: "maticmum",
    explorerUrl: "https://mumbai.polygonscan.com",
    explorerApiUrl: "https://api-testnet.polygonscan.com",
    rpcUrl: "https://rpc-mumbai.matic.today",
    nativeCurrency: {
      name: "MATIC",
      symbol: "mMATIC",
      decimals: 18,
    },
  },
};
