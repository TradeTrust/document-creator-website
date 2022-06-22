import { ERC165 } from "@govtechsg/token-registry/dist/types/contracts";
import { getLogger } from "../../../utils/logger";

const { error } = getLogger("services:supportsinterface");

export const supportsInterface = async (
  contractInstance: ERC165,
  interfaceId: string,
  staticCall = true
): Promise<boolean | undefined> => {
  let isSameInterfaceType;
  try {
    if (staticCall) {
      isSameInterfaceType = await contractInstance.callStatic.supportsInterface(interfaceId);
    } else {
      isSameInterfaceType = await contractInstance.supportsInterface(interfaceId);
    }

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
