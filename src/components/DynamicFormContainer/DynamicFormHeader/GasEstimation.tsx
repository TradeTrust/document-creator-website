import { ButtonIcon, OverlayContext, Textual } from "@govtechsg/tradetrust-ui-components";
import { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from "react";
import { GasSelectorContext, useGasSelectorContext } from "../../../common/context/network";
import { usePersistedConfigFile } from "../../../common/hook/usePersistedConfigFile";
import { useConfigContext } from "../../../common/context/config";
import { ChainInfo } from "../../../constants/chainInfo";
import { getNetworkDetails } from "../../../common/utils";
import { request } from "http";
import { getEtherscanNetworkApiDetails } from "../../../config";
import { chain } from "lodash";
import { BigNumber, Wallet } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { ConnectedSigner } from "../../../types";
import { Info } from "react-feather";

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
  // const { gasSpeed, setGasSpeed } = useGasSelectorContext();
  const { showOverlay } = useContext(OverlayContext);
  const openModal = () => {
    showOverlay(GasSelectionGuide);
  };

  const { networkGasInformation, setNetworkGasInformation } = useGasSelectorContext();
  const { config } = useConfigContext();
  const wallet = config?.wallet;
  const network = config?.network;

  if (!wallet) throw new Error("No wallet found in config");
  if (!network) throw new Error("No network found in config");
  const chainInfo = getNetworkDetails(network);
  const etherscanDetails = getEtherscanNetworkApiDetails(chainInfo);
  const noApiProvider = !etherscanDetails.apiKey || !etherscanDetails.hostname;

  useEffect(() => {
    const noProvider = (): void => {
      const twoGwei = BigNumber.from(2000000000);
      const networkGasStatus = [
        {
          speed: "market",
          price: formatUnits(twoGwei, "gwei"),
          network: chainInfo.networkName,
          maxPriorityFeePerGas: twoGwei,
        },
      ];
      setNetworkGasInformation(networkGasStatus);
    };
    const getProviderNetworkPriority = async () => {
      //(wallet?: Wallet | ConnectedSigner) => {
      const scaleBigNumber = (wei: BigNumber | null | undefined, multiplier: number, precision = 2): BigNumber => {
        if (wei === null || typeof wei === "undefined") {
          throw new Error("Wei not specified");
        }
        const padding = Math.pow(10, precision);
        const newMultiplier = Math.round(padding * multiplier);

        const newWei = wei.mul(newMultiplier).div(padding);
        return newWei;
      };

      if (!wallet) return noProvider();
      const feeData = await wallet.getFeeData();
      const priorityFee = feeData.maxPriorityFeePerGas;
      if (!priorityFee) return noProvider();

      const SafeGasPrice = scaleBigNumber(priorityFee, 0.9);
      const ProposeGasPrice = priorityFee;
      const FastGasPrice = scaleBigNumber(priorityFee, 1.2);

      const networkGasStatus = [
        {
          speed: "low",
          price: formatUnits(SafeGasPrice, "gwei"),
          network: chainInfo.networkName,
          maxPriorityFeePerGas: SafeGasPrice,
        },
        {
          speed: "market",
          price: formatUnits(ProposeGasPrice, "gwei"),
          network: chainInfo.networkName,
          maxPriorityFeePerGas: ProposeGasPrice,
        },
        {
          speed: "agressive",
          price: formatUnits(FastGasPrice, "gwei"),
          network: chainInfo.networkName,
          maxPriorityFeePerGas: FastGasPrice,
        },
      ];
      setNetworkGasInformation(networkGasStatus);
    };
    const callGasTrackerAPI = async () => {
      const callGasDurationAPI = async (gasPrice: BigNumber) => {
        // const suggestedPriceDResponse = async() => {
        const suggestedPriceDResponse = await fetch(
          etherscanDetails.hostname +
            `/api?module=gastracker&action=gasestimate&gasprice=${formatUnits(gasPrice, 0)}&apikey=` +
            etherscanDetails.apiKey
        );
        const suggestedPriceDuration = await suggestedPriceDResponse.json();
        return suggestedPriceDuration.result;
        // }
      };
      const suggestedPriceResponse = await fetch(
        etherscanDetails.hostname + "/api?module=gastracker&action=gasoracle&apikey=" + etherscanDetails.apiKey
      );
      const suggestedPriceObject = await suggestedPriceResponse.json();

      const {
        SafeGasPrice: SafeGasPriceNumber,
        ProposeGasPrice: ProposeGasPriceNumber,
        FastGasPrice: FastGasPriceNumber,
      } = suggestedPriceObject.result;
      const oneGwei = BigNumber.from("1000000000");

      const SafeGasPrice = BigNumber.from(SafeGasPriceNumber).mul(oneGwei);
      const ProposeGasPrice = BigNumber.from(ProposeGasPriceNumber).mul(oneGwei);
      const FastGasPrice = BigNumber.from(FastGasPriceNumber).mul(oneGwei);
      const networkGasStatus = [
        {
          speed: "low",
          price: formatUnits(SafeGasPrice, "gwei"),
          duration: await callGasDurationAPI(SafeGasPrice),
          network: chainInfo.networkName,
          maxPriorityFeePerGas: SafeGasPrice,
        },
        {
          speed: "market",
          price: formatUnits(ProposeGasPrice, "gwei"),
          duration: await callGasDurationAPI(ProposeGasPrice),
          network: chainInfo.networkName,
          maxPriorityFeePerGas: ProposeGasPrice,
        },
        {
          speed: "agressive",
          price: formatUnits(FastGasPrice, "gwei"),
          duration: await callGasDurationAPI(FastGasPrice),
          network: chainInfo.networkName,
          maxPriorityFeePerGas: FastGasPrice,
        },
      ];
      setNetworkGasInformation(networkGasStatus);
    };

    if (noApiProvider) {
      getProviderNetworkPriority();
    } else {
      callGasTrackerAPI();
    }
  }, [network]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h3 data-testid="set-gas-amount" className="my-8">
        Select Gas Estimation <Info size="0.6em" color="blue" onClick={openModal} />
      </h3>
      {networkGasInformation?.map((gasInfo) => (
        <RatesSelector key={gasInfo.speed} speed={gasInfo.speed} price={gasInfo.price} duration={gasInfo.duration} />
      ))}
    </div>
  );
};
