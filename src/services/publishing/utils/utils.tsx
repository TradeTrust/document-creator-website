import { Contract } from "ethers";
import { getLogger } from "../../../utils/logger";

const { error } = getLogger("services:supportsinterface");

interface Erc165Contract extends Contract {
  supportsInterface: (interfaceId: string) => Promise<boolean>;
}

export const supportsInterface = async (
  contractInstance: Erc165Contract,
  interfaceId: string
): Promise<boolean> => {
  let isSameInterfaceType = false;
  try {
    isSameInterfaceType = await contractInstance.supportsInterface(interfaceId);
  } catch (supportsInterfaceErrorMessage) {
    error(supportsInterfaceErrorMessage);
  }
  return isSameInterfaceType;
};
