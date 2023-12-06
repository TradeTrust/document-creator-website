import { ButtonIcon, OverlayContext, Textual } from "@govtechsg/tradetrust-ui-components";
import { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from "react";
import {
  GasSelectorContext,
  SuggestedGasFee,
  SuggestedGasFeeList,
  useGasSelectorContext,
} from "../../../common/context/network";
import { usePersistedConfigFile } from "../../../common/hook/usePersistedConfigFile";
import { useConfigContext } from "../../../common/context/config";
import { ChainInfo, ChainInfoObject } from "../../../constants/chainInfo";
import { getNetworkDetails } from "../../../common/utils";
import { request } from "http";
import { EtherscanNetworkApiDetails, getEtherscanNetworkApiDetails } from "../../../config";
import { BigNumber, Wallet } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { ConnectedSigner, Network, NetworkGasInformation, NetworkGasOption } from "../../../types";
import { Info } from "react-feather";
import { useTime, useTimer } from "react-timer-hook";

interface DynamicFormHeaderProps {
  test?: string;
  //   onBackToFormSelection: () => void;
  //   onNewForm: () => void;
  //   onFormSubmit: () => void;
  //   validateCurrentForm: () => boolean;
  //   closePreviewMode: () => void;
}

// const DismissalButton: FunctionComponent<{ buttonText?: string }> = ({
//   buttonText = "Dismiss",
// }: {
//   buttonText?: string;
// }) => {
// const { closeOverlay } = useOverlayContext();
// return (
//   <Button
//     className="bg-cerulean-500 hover:bg-cerulean-800 rounded-xl px-3 py-2 mx-auto mt-3 text-white font-normal"
//     onClick={closeOverlay}
//   >
//     {buttonText}
//   </Button>
// );
// };

const GasSelectionGuide: FunctionComponent<void> = () => {
  // TODO: use Confirmation Content
  return (
    <Textual title={"Gas Estimation"}>
      <p>
        The Gas Estimation Selector empowers you to tailor your preferences, enabling you to select the cost you&apos;re
        at ease with.
        <br />
        <br />
        <b>Low</b>: is lower rate than market prices and it allows a user to pay a lower fee when they are willing to
        wait a longer time. It allows you to wait a longer period and skip the price spikes (i.e. save money). Note that
        this setting is based on past trends, which means we can never be sure the transaction goes through. If you
        require a transaction to go through, this may not be the right setting for you.
        <br />
        <br />
        <b>Market</b>: reflects market prices.
        <br />
        <br />
        <b>Aggressive</b>: is much higher compared to market prices. It allows you to set a higher max fee and priority
        fee to increase the likelihood of your transaction being successful if you’re expecting to participate in a gas
        war.
        <br />
        <br />
        The provided cost and speed are estimations derived from real-time gas prices, which are updated every 5
        seconds.
      </p>
    </Textual>
  );
};

// const retrieveGasPrice = async () => {
//   const { setNetworkGasInformation, networkGasInformation } = useGasSelectorContext();
//   const { config } = useConfigContext();
//   const wallet = config?.wallet;
//   const network = config?.network;

//   if (!wallet) throw new Error("No wallet found in config");
//   const { maxFeePerGas, maxPriorityFeePerGas } = await wallet.getFeeData();
//   if (!network) throw new Error("No network found in config");
//   const chainInfo = getNetworkDetails(network);
//   const etherscanDetails = getEtherscanNetworkApiDetails(chainInfo);
//   const response = (
//     await fetch(etherscanDetails.hostname + "/api?module=gastracker&action=gasoracle&apikey=" + etherscanDetails.apiKey)
//   ).json();
//   console.log(response);
// setNetworkGasInformation({})
// };

const RatesSelector: FunctionComponent<{ speed: string; price: string; duration?: number }> = ({
  speed,
  price,
  duration,
}: {
  speed: string;
  price: string;
  duration?: number;
}) => {
  const { gasSpeed, setGasSpeed } = useGasSelectorContext();

  const durationDisplay = (seconds?: number): string => {
    if (!seconds) return "";
    const minuteString = seconds >= 60 ? `${Math.floor(seconds / 60)}m` : "";
    const secondsString = seconds % 60 > 0 ? `${seconds % 60}s` : "";
    const durationString = !!minuteString ? minuteString + " " : "" + secondsString;
    return ` | ${durationString} (estimated)`;
  };
  const priceDisplay = (priceGwei?: string): string => {
    return `~${priceGwei} gwei`;
  };
  const speedLabel = `${speed.charAt(0).toUpperCase()}${speed.slice(1)}`;
  const setGasSpeedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedSpeed: string = event.target.value;
    setGasSpeed(selectedSpeed);
  };

  return (
    <div className="flex">
      <input
        className="flex-none mr-3"
        type="radio"
        name="rate"
        value={speed}
        onChange={setGasSpeedHandler}
        checked={speed === gasSpeed}
      />
      <div className="flex-auto">
        <div className="font-bold">{speedLabel}</div>
        <div className="text-cloud-400">
          {priceDisplay(price)}
          {durationDisplay(duration)}
        </div>
      </div>
    </div>
  );
};

const fetchPriorityWaitTime = async (chainInfo: ChainInfoObject, gasPrice: BigNumber): Promise<number> => {
  const etherscanDetails = getEtherscanNetworkApiDetails(chainInfo);
  const suggestedPriceDurationResponse = await fetch(
    etherscanDetails.hostname +
      `/api?module=gastracker&action=gasestimate&gasprice=${formatUnits(gasPrice, 0)}&apikey=` +
      etherscanDetails.apiKey
  );
  const suggestedPriceDuration = await suggestedPriceDurationResponse.json();
  return Number(suggestedPriceDuration.result);
};

const fetchGasPriceSuggestions = async (network: Network): Promise<SuggestedGasFeeList> => {
  const chainInfo = getNetworkDetails(network);
  const etherscanDetails = getEtherscanNetworkApiDetails(chainInfo);
  const isPolygon = ["maticmum", "matic"].includes(network);
  const isMainnet = ["matic", "homestead"];
  const suggestedPrice = await (isPolygon
    ? fetchPolygonGasStationSuggestedPrice(network)
    : fetchEtherscanSuggestedPrice(etherscanDetails));
  console.log(JSON.stringify(suggestedPrice));
  const lowPriorityFee = parseUnits(suggestedPrice.priorityFee.low.toFixed(9).toString(), "gwei");
  const marketPriorityFee = parseUnits(suggestedPrice.priorityFee.market.toFixed(9).toString(), "gwei");
  const agressivePriorityFee = parseUnits(suggestedPrice.priorityFee.agressive.toFixed(9).toString(), "gwei");
  const baseFee = parseUnits(suggestedPrice.baseFee.toFixed(9).toString(), "gwei");
  const lowMaxFee = baseFee.add(lowPriorityFee);
  const marketMaxFee = baseFee.add(marketPriorityFee);
  const agressiveMaxFee = baseFee.add(agressivePriorityFee);
  const gasPriceOptions: SuggestedGasFeeList = {
    priorityFee: {
      low: {
        priorityFee: lowPriorityFee,
        maxFee: lowMaxFee,
      },
      market: {
        priorityFee: marketPriorityFee,
        maxFee: marketMaxFee,
      },
      agressive: {
        priorityFee: agressivePriorityFee,
        maxFee: agressiveMaxFee,
      },
    },
    baseFee: baseFee,
  };

  if (!isPolygon && isMainnet) {
    gasPriceOptions.priorityFee.low.duration = await fetchPriorityWaitTime(chainInfo, lowMaxFee);
    gasPriceOptions.priorityFee.market.duration = await fetchPriorityWaitTime(chainInfo, marketMaxFee);
    gasPriceOptions.priorityFee.agressive.duration = await fetchPriorityWaitTime(chainInfo, agressiveMaxFee);
  }

  console.log(JSON.stringify(gasPriceOptions));
  return gasPriceOptions;
};

const fetchPolygonGasStationSuggestedPrice = async (network: Network): Promise<SuggestedGasFee> => {
  const testnetURL = network === "maticmum" ? "-testnet" : "";
  const apiUrl = "https://gasstation" + testnetURL + ".polygon.technology/v2";

  const suggestedPriceResponse = await fetch(apiUrl);
  const suggestedPriceObject = await suggestedPriceResponse.json();
  return {
    priorityFee: {
      low: suggestedPriceObject.safeLow.maxPriorityFee,
      market: suggestedPriceObject.standard.maxPriorityFee,
      agressive: suggestedPriceObject.fast.maxPriorityFee,
    },
    baseFee: suggestedPriceObject.estimatedBaseFee,
  };
};

const fetchEtherscanSuggestedPrice = async (etherscanDetails: EtherscanNetworkApiDetails): Promise<SuggestedGasFee> => {
  const suggestedPriceResponse = await fetch(
    etherscanDetails.hostname + "/api?module=gastracker&action=gasoracle&apikey=" + etherscanDetails.apiKey
  );
  const suggestedPriceObject = await suggestedPriceResponse.json();
  const {
    SafeGasPrice: lowPriorityFee,
    ProposeGasPrice: marketPriorityFee,
    FastGasPrice: agressivePriorityFee,
    suggestBaseFee: baseFee,
  } = suggestedPriceObject.result;
  return {
    priorityFee: {
      low: Number(lowPriorityFee),
      market: Number(marketPriorityFee),
      agressive: Number(agressivePriorityFee),
    },
    baseFee: Number(baseFee),
  };
};

export const GasEstimation: FunctionComponent<DynamicFormHeaderProps> = (
  {
    // test,
    //   onBackToFormSelection,
    //   onNewForm,
    //   onFormSubmit,
    //   validateCurrentForm,
    //   closePreviewMode,
  }
) => {
  const { gasSpeed } = useGasSelectorContext();
  const { showOverlay } = useContext(OverlayContext);
  const openModal = () => {
    showOverlay(GasSelectionGuide);
  };

  const { networkGasInformation, setNetworkGasInformation } = useGasSelectorContext();
  const { config } = useConfigContext();
  const wallet = config?.wallet;

  // const network = config?.network;
  const network = "maticmum";

  const supportedNetwork = ["homestead", "matic", "maticmum"];

  if (!wallet) throw new Error("No wallet found in config");
  if (!network) throw new Error("No network found in config");

  useEffect(() => {
    const updateGasFeeOptions = async () => {
      const gasFeeOptions = await fetchGasPriceSuggestions(network);
      console.log(gasFeeOptions);
      setNetworkGasInformation(gasFeeOptions);
    };
    if (supportedNetwork.includes(network)) {
      setInterval(() => {
        console.log(new Date());
        updateGasFeeOptions();
        console.log(gasSpeed);
      }, 10000);
    }
  }, [network]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h3 data-testid="set-gas-amount" className="my-8">
        Select Gas Estimation <Info size="0.6em" color="blue" onClick={openModal} />
        <RatesSelector
          key={"low"}
          speed={"low"}
          price={formatUnits(networkGasInformation?.priorityFee.low.maxFee || 0, "gwei")}
          duration={networkGasInformation?.priorityFee.low.duration}
        />
        <RatesSelector
          key={"market"}
          speed={"market"}
          price={formatUnits(networkGasInformation?.priorityFee.market.maxFee || 0, "gwei")}
          duration={networkGasInformation?.priorityFee.market.duration}
        />
        <RatesSelector
          key={"agressive"}
          speed={"agressive"}
          price={formatUnits(networkGasInformation?.priorityFee.agressive.maxFee || 0, "gwei")}
          duration={networkGasInformation?.priorityFee.agressive.duration}
        />
      </h3>
    </div>
  );
};
