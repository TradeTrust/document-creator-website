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
  } catch (e) {
    if (e instanceof Error) {
      if (e.message.includes("revert") || e.message.includes("cannot estimate gas")) {
        return false;
      }
      error(e);
      throw e;
    }
  }
};
