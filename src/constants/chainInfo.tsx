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
  Goerli = 5,
  Sepolia = 11155111,

  // Polygon
  Polygon = 137,
  PolygonMumbai = 80001,

  // XDC Network
  XDC = 50,
  XDCApothem=51,
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
    rpcUrl: "https://rpc-mumbai.maticvigil.com/",
    nativeCurrency: {
      name: "MATIC",
      symbol: "mMATIC",
      decimals: 18,
    },
  },
  [ChainId.XDC]: {
    label: "XDC Network Mainnet",
    chain: "XDC",
    chainId: ChainId.XDC,
    networkName: "xdc",
    explorerUrl: "https://xdc.blocksscan.io",
    explorerApiUrl: "https://xdc.blocksscan.io",
    rpcUrl: "https://erpc.xinfin.network",
    nativeCurrency: {
      name: "XDC",
      symbol: "XDC",
      decimals: 18,
    },
  },
  [ChainId.XDCApothem]: {
    label: "XDC Testnet Apothem",
    chain: "XDC",
    chainId: ChainId.XDCApothem,
    networkName: "xdcapothem",
    explorerUrl: "https://apothem.blocksscan.io",
    explorerApiUrl: "https://apothem.blocksscan.io",
    rpcUrl: "https://erpc.apothem.network",
    nativeCurrency: {
      name: "XDCt",
      symbol: "XDCt",
      decimals: 18,
    },
  },
};
