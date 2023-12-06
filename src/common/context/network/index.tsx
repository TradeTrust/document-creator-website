import { useState, useContext, createContext, FunctionComponent } from "react";
// import { NetworkGasInformation } from "../../../types";
import { useConfigContext } from "../config";
import { getNetworkDetails } from "../../utils";
import { getEtherscanNetworkApiDetails } from "../../../config";
import { BigNumber } from "ethers";

export interface PriorityFeeContext {
  duration?: number;
  priorityFee: BigNumber;
  maxFee: BigNumber;
}

export interface SelectedFee {
  baseFee?: BigNumber;
  priorityFee?: BigNumber;
  maxFee?: BigNumber;
}

export interface SuggestedGasFeeList {
  priorityFee: {
    low: PriorityFeeContext;
    market: PriorityFeeContext;
    agressive: PriorityFeeContext;
  };
  baseFee: BigNumber;
}

export interface SuggestedGasFee {
  priorityFee: {
    low: number;
    market: number;
    agressive: number;
  };
  baseFee: number;
}

interface GasSelectorContext {
  networkGasInformation?: SuggestedGasFeeList;
  setNetworkGasInformation: (config?: SuggestedGasFeeList) => void;
  gasSpeed?: string;
  setGasSpeed: (speed?: string) => void;
}

export const GasSelectorContext = createContext<GasSelectorContext>({
  networkGasInformation: undefined,
  setNetworkGasInformation: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  gasSpeed: undefined,
  setGasSpeed: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useGasSelectorContext = (): GasSelectorContext => useContext<GasSelectorContext>(GasSelectorContext);

export const GasSelectorProvider: FunctionComponent = ({ children }) => {
  const [networkGasInformation, setNetworkGasInformation] = useState<SuggestedGasFeeList>();
  const [gasSpeed, setGasSpeed] = useState<string>();
  return (
    <GasSelectorContext.Provider
      value={{
        networkGasInformation,
        setNetworkGasInformation,
        gasSpeed,
        setGasSpeed,
      }}
    >
      {children}
    </GasSelectorContext.Provider>
  );
};
