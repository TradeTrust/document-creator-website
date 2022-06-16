import { ERC165 } from "@govtechsg/token-registry/dist/types/contracts";
import { Contract } from "ethers";
import { getLogger } from "../../../utils/logger";

const { error } = getLogger("services:supportsinterface");

export const supportsInterface = async (
  contractInstance: ERC165,
  interfaceId: string,
  staticCall: boolean = true
): Promise<boolean | undefined> => {
  let isSameInterfaceType;
  try {
    
    if(staticCall){
      isSameInterfaceType = await contractInstance.callStatic.supportsInterface(interfaceId);
    }else{
      isSameInterfaceType = await contractInstance.supportsInterface(interfaceId);
    }
    
    return isSameInterfaceType;
  } catch (supportsInterfaceErrorMessage) {
    if (
      supportsInterfaceErrorMessage.message.includes("revert") ||
      supportsInterfaceErrorMessage.message.includes("cannot estimate gas")
    ) {
      return false;
    }
    error(supportsInterfaceErrorMessage);
    throw supportsInterfaceErrorMessage;
  }
};