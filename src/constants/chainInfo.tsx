import { Network } from "../types";
export interface ChainInfoObject {
  label: string;
  chain: string;
  chainId: ChainId;
  networkName: Network; // network name that aligns with existing NETWORK_NAME
  explorerUrl: string;
  explorerApiUrl?: string;
  rpcUrl?: string;
  gasStationUrl?: string;
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
  Sepolia = 11155111,

  // Polygon
  Polygon = 137,
  PolygonMumbai = 80001,

  // XDC Network
  XDC = 50,
  XDCApothem = 51,

  //Hedera Network
  HederaMainnet = 295,
  HederaTestnet = 296,

  // Stability Network
  StabilityTestnet = 20180427
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
  [ChainId.Sepolia]: {
    label: "Sepolia",
    chain: "ETH",
    chainId: ChainId.Sepolia,
    networkName: "sepolia",
    explorerUrl: "https://sepolia.etherscan.io",
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
  [ChainId.HederaMainnet]: {
    label: "Hedera Network Mainnet",
    chain: "Hedera",
    chainId: ChainId.HederaMainnet,
    networkName: "hederamainnet",
    explorerUrl: "https://hashscan.io/mainnet",
    explorerApiUrl: "https://hashscan.io/mainnet",
    rpcUrl: "https://mainnet.hashio.io/api",
    nativeCurrency: {
      name: "HBAR",
      symbol: "HBAR",
      decimals: 18,
    },
  },
  [ChainId.HederaTestnet]: {
    label: "Hedera Network TestNet",
    chain: "Hedera",
    chainId: ChainId.HederaTestnet,
    networkName: "hederatestnet",
    explorerUrl: "https://hashscan.io/testnet",
    explorerApiUrl: "https://hashscan.io/testnet",
    rpcUrl: "https://testnet.hashio.io/api",
    nativeCurrency: {
      name: "HBAR",
      symbol: "HBAR",
      decimals: 18,
    },
  },
  [ChainId.StabilityTestnet]: {
    label: "Stability Network TestNet",
    chain: "Stability",
    chainId: ChainId.StabilityTestnet,
    networkName: "stabilitytestnet",
    explorerUrl: "https://stability-testnet.blockscout.com",
    explorerApiUrl: "https://stability-testnet.blockscout.com",
    rpcUrl: "https://free.testnet.stabilityprotocol.com",
    nativeCurrency: {
      name: "FREE",
      symbol: "FREE",
      decimals: 18,
    },
  },
};

export const getSupportedNetworkNameFromId = (networkId: number): Network => {
  const chainIndo = Object.values(ChainInfo).find((network) => network.chainId === networkId);
  if (!chainIndo) {
    throw new Error(`Unsupported chain id ${networkId}`);
  }
  return chainIndo.networkName;
};
