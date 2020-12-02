import { Contract } from "ethers";
import { getLogger } from "../../../utils/logger";

const { error } = getLogger("services:supportsinterface");

interface Erc165Contract extends Contract {
  supportsInterface: (interfaceId: string) => Promise<boolean>;
}

export const supportsInterface = async (
  contractInstance: Erc165Contract,
  interfaceId: string
): Promise<boolean | undefined> => {
  let isSameInterfaceType;
  try {
    isSameInterfaceType = await contractInstance.supportsInterface(interfaceId);
    return isSameInterfaceType;
  } catch (supportsInterfaceErrorMessage) {
    if (supportsInterfaceErrorMessage.message.includes("call revert exception")) {
      return false;
    }
    error(supportsInterfaceErrorMessage);
    throw supportsInterfaceErrorMessage;
  }
};
