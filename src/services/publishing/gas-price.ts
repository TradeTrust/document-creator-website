import { getNetworkDetails } from "../../common/utils";
import { EtherscanNetworkApiDetails, getEtherscanNetworkApiDetails } from "../../config/config";
import { BigNumber, Overrides } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { Network } from "../../types";
import { getSupportedNetworkNameFromId } from "../../constants/chainInfo";

export interface SuggestedGasPrice {
  maxPriorityFeePerGas: BigNumber;
  maxFeePerGas: BigNumber;
}

export const fetchGasPriceSuggestions = async (
  chainId: number,
  additionalOverrides?: Overrides
): Promise<Overrides> => {
  const network = getSupportedNetworkNameFromId(chainId);
  const chainInfo = getNetworkDetails(network);
  const etherscanDetails = getEtherscanNetworkApiDetails(chainInfo);
  const isPolygon = ["matic", "amoy"].includes(network);
  const isMainnet = ["homestead"].includes(network);
  const isStability = ["stability", "stabilitytestnet"].includes(network);
  const isAstron = ["astron", "astrontestnet"].includes(network);
  if (!isMainnet && !isPolygon && !isStability) return { ...additionalOverrides };
  let maxPriorityFeePerGas;
  let maxFeePerGas;
  if (isPolygon) {
    ({ maxPriorityFeePerGas, maxFeePerGas } = await fetchPolygonGasStationSuggestedPrice(network));
  } else if (isStability) {
    ({ maxPriorityFeePerGas, maxFeePerGas } = await fetchStabilityNetworkSuggestedPrice(network));
  } else if (isAstron) {
    ({ maxPriorityFeePerGas, maxFeePerGas } = await fetchAstronNetworkSuggestedPrice(network));
  } else {
    ({ maxPriorityFeePerGas, maxFeePerGas } = await fetchEtherscanSuggestedPrice(etherscanDetails));
  }

  return {
    maxPriorityFeePerGas,
    maxFeePerGas,
    ...additionalOverrides,
  };
};

export const fetchStabilityNetworkSuggestedPrice = async (network: Network): Promise<SuggestedGasPrice> => {
  if (!["stability", "stabilitytestnet"].includes(network)) {
    throw new Error("Unsupported network for stability gas station");
  }

  return {
    maxPriorityFeePerGas: BigNumber.from(0),
    maxFeePerGas: BigNumber.from(0),
  };
};

export const fetchAstronNetworkSuggestedPrice = async (network: Network): Promise<SuggestedGasPrice> => {
  let apiUrl: string;
  switch (network) {
    case "astron":
      apiUrl = "https://astronscanl2.bitfactory.cn/gas-station";
      break;
    case "astrontestnet":
      apiUrl = "https://dev-astronscanl2.bitfactory.cn/gas-station";
      break;
    default:
      throw new Error("Unsupported network for astron gas station");
  }

  const suggestedPriceResponse = await fetch(apiUrl);
  const suggestedPriceObject = await suggestedPriceResponse.json();

  const maxPriorityFeePerGas = safeParseUnits(suggestedPriceObject.standard.maxPriorityFee, 9);
  const maxFeePerGas = safeParseUnits(suggestedPriceObject.standard.maxFee, 9);
  return {
    maxPriorityFeePerGas,
    maxFeePerGas,
  };
};

const fetchPolygonGasStationSuggestedPrice = async (network: Network): Promise<SuggestedGasPrice> => {
  let apiUrl: string;
  switch (network) {
    case "matic":
      apiUrl = "https://gasstation.polygon.technology/v2";
      break;
    case "amoy":
      apiUrl = "https://gasstation-testnet.polygon.technology/amoy";
      break;
    default:
      throw new Error("Unsupported network for polygon gas station");
  }

  const suggestedPriceResponse = await fetch(apiUrl);
  const suggestedPriceObject = await suggestedPriceResponse.json();
  return {
    maxPriorityFeePerGas: safeParseUnits(suggestedPriceObject.standard.maxPriorityFee, 9),
    maxFeePerGas: safeParseUnits(suggestedPriceObject.standard.maxFee, 9),
  };
};

const fetchEtherscanSuggestedPrice = async (
  etherscanDetails: EtherscanNetworkApiDetails
): Promise<SuggestedGasPrice> => {
  const suggestedPriceResponse = await fetch(
    etherscanDetails.hostname + "/api?module=gastracker&action=gasoracle&apikey=" + etherscanDetails.apiKey
  );
  const suggestedPriceObject = await suggestedPriceResponse.json();
  const maxPriorityFeePerGas = safeParseUnits(suggestedPriceObject.result.ProposeGasPrice, 9);
  const baseFee = safeParseUnits(suggestedPriceObject.result.suggestBaseFee, 9);
  const maxFeePerGas = baseFee.add(maxPriorityFeePerGas);
  return {
    maxPriorityFeePerGas,
    maxFeePerGas,
  };
};

export const safeParseUnits = (_value: number | string, decimals: number): BigNumber => {
  const value = String(_value);
  if (!value.match(/^[0-9.]+$/)) {
    throw new Error(`invalid gwei value: ${_value}`);
  }

  // Break into [ whole, fraction ]
  const comps = value.split(".");
  if (comps.length === 1) {
    comps.push("");
  }

  // More than 1 decimal point or too many fractional positions
  if (comps.length !== 2) {
    throw new Error(`invalid gwei value: ${_value}`);
  }

  // Pad the fraction to 9 decimal places
  while (comps[1].length < decimals) {
    comps[1] += "0";
  }

  // Too many decimals and some non-zero ending, take the ceiling
  if (comps[1].length > 9 && !comps[1].substring(9).match(/^0+$/)) {
    comps[1] = BigNumber.from(comps[1].substring(0, 9)).add(BigNumber.from(1)).toString();
  }

  return parseUnits(`${comps[0]}.${comps[1]}`, decimals);
};
