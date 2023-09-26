import { useState, useContext, createContext, FunctionComponent } from "react";
import { NetworkGasInformation } from "../../../types";
import { useConfigContext } from "../config";
import { getNetworkDetails } from "../../utils";
import { getEtherscanNetworkApiDetails } from "../../../config";

// export interface NetworkGasInformation {
//   speed: string;
//   price: string;
//   duration: string;
//   network: string;

//   maxPriorityFeePerGas: BigNumber;
//   maxFeePerGas: BigNumber;
// }

interface GasSelectorContext {
  networkGasInformation?: NetworkGasInformation[];
  setNetworkGasInformation: (config?: NetworkGasInformation[]) => void;
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
  const [networkGasInformation, setNetworkGasInformation] = useState<NetworkGasInformation[]>();
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
