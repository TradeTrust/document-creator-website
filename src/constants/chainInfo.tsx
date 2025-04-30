import { STABILITY_API_KEY, STABILITY_TESTNET_API_KEY, INFURA_API_KEY, ASTRON_TESTNET_API_KEY } from "../config";
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

  // Ethereum
  Ethereum = 1,
  Sepolia = 11155111,

  // Polygon
  Polygon = 137,
  Amoy = 80002,

  // XDC Network
  XDC = 50,
  XDCApothem = 51,

  // Stability Network
  StabilityTestnet = 20180427,
  Stability = 101010,

  // Astron Network
  Astron = 1338,
  AstronTestnet = 21002,
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
    chain: "ETH", // Must be the same as nativeCurrency.name
    chainId: ChainId.Ethereum,
    networkName: "homestead",
    explorerUrl: "https://etherscan.io",
    explorerApiUrl: "https://api.etherscan.io",
  },
  [ChainId.Sepolia]: {
    label: "Sepolia",
    chain: "ETH", // Must be the same as nativeCurrency.name
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
    chain: "MATIC", // Must be the same as nativeCurrency.name
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
  [ChainId.Amoy]: {
    label: "Amoy",
    chain: "MATIC", // Must be the same as nativeCurrency.name
    chainId: ChainId.Amoy,
    networkName: "amoy",
    explorerUrl: "https://www.oklink.com/amoy",
    rpcUrl: `https://polygon-amoy.infura.io/v3/${INFURA_API_KEY}`,
    nativeCurrency: {
      name: "MATIC",
      symbol: "aMATIC",
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
    rpcUrl: "https://rpc.ankr.com/xdc",
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
    rpcUrl: "https://rpc.ankr.com/xdc_testnet",
    nativeCurrency: {
      name: "XDCt",
      symbol: "XDCt",
      decimals: 18,
    },
  },
  [ChainId.StabilityTestnet]: {
    label: "Stability Network TestNet",
    chain: "FREE",
    chainId: ChainId.StabilityTestnet,
    networkName: "stabilitytestnet",
    explorerUrl: "https://stability-testnet.blockscout.com",
    explorerApiUrl: "https://stability-testnet.blockscout.com/api",
    rpcUrl: `https://rpc.testnet.stabilityprotocol.com/zgt/${STABILITY_TESTNET_API_KEY}`,
    nativeCurrency: {
      name: "FREE",
      symbol: "FREE",
      decimals: 18,
    },
  },
  [ChainId.Stability]: {
    label: "Stability (Beta)",
    chain: "FREE",
    chainId: ChainId.Stability,
    networkName: "stability",
    explorerUrl: "https://stability.blockscout.com",
    explorerApiUrl: "https://stability.blockscout.com/api",
    rpcUrl: `https://rpc.stabilityprotocol.com/zgt/${STABILITY_API_KEY}`,
    nativeCurrency: {
      name: "FREE",
      symbol: "FREE",
      decimals: 18,
    },
  },
  [ChainId.Astron]: {
    label: "Astron",
    chain: "ASTRON",
    chainId: ChainId.Astron,
    networkName: "astron",
    explorerUrl: "https://astronscanl2.bitfactory.cn",
    explorerApiUrl: "https://astronscanl2.bitfactory.cn/api",
    rpcUrl: `https://astronlayer2.bitfactory.cn/rpc/`,
    nativeCurrency: {
      name: "ASTRON",
      symbol: "ASTRON",
      decimals: 18,
    },
  },
  [ChainId.AstronTestnet]: {
    label: "Astron",
    chain: "ASTRON",
    chainId: ChainId.AstronTestnet,
    networkName: "astrontestnet",
    explorerUrl: "https://dev-astronscanl2.bitfactory.cn",
    explorerApiUrl: "https://dev-astronscanl2.bitfactory.cn/api",
    rpcUrl: `https://dev-astronlayer2.bitfactory.cn/auth/${ASTRON_TESTNET_API_KEY}`,
    nativeCurrency: {
      name: "ASTRON",
      symbol: "ASTRON",
      decimals: 18,
    },
  },
};

export const supportedMainnet = [
  ChainInfo[ChainId.Ethereum].networkName,
  ChainInfo[ChainId.Polygon].networkName,
  ChainInfo[ChainId.XDC].networkName,
  ChainInfo[ChainId.Stability].networkName,
  ChainInfo[ChainId.Astron].networkName,
];

export const supportedTestnet = [
  ChainInfo[ChainId.Sepolia].networkName,
  ChainInfo[ChainId.Amoy].networkName,
  ChainInfo[ChainId.XDCApothem].networkName,
  ChainInfo[ChainId.StabilityTestnet].networkName,
  ChainInfo[ChainId.AstronTestnet].networkName,
];

export const getSupportedNetworkNameFromId = (networkId: number): Network => {
  const chainIndo = Object.values(ChainInfo).find((network) => network.chainId === networkId);
  if (!chainIndo) {
    throw new Error(`Unsupported chain id ${networkId}`);
  }
  return chainIndo.networkName;
};
