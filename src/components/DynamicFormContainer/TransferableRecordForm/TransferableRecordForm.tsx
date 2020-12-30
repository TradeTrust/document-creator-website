import { useThirdPartyAPIEndpoints } from "@govtechsg/address-identity-resolver";
import { AddressBook, ButtonIcon, useOverlayContext } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { Book } from "react-feather";
import { usePersistedConfigFile } from "../../../common/hook/usePersistedConfigFile";

interface TransferableRecordForm {
  beneficiaryAddress: string;
  holderAddress: string;
  setBeneficiaryAddress: (address: string) => void;
  setHolderAddress: (address: string) => void;
}

export const TransferableRecordForm: FunctionComponent<TransferableRecordForm> = ({
  beneficiaryAddress,
  setBeneficiaryAddress,
  holderAddress,
  setHolderAddress,
}) => {
  const { showOverlay } = useOverlayContext();
  const { thirdPartyAPIEndpoints } = useThirdPartyAPIEndpoints();
  const { configFile } = usePersistedConfigFile();

  const onOverlayHandler = (onAddressSelected: (address: string) => void): void => {
    showOverlay(
      <AddressBook
        title="Address Book"
        onAddressSelected={onAddressSelected}
        thirdPartyAPIEndpoints={thirdPartyAPIEndpoints}
        network={configFile?.network ?? "local"}
      />
    );
  };

  return (
    <div
      data-testid="transferable-record-form"
      className="border border-solid border-grey-300 p-3  rounded bg-grey-100 mb-8"
    >
      <div className="text-grey-800 font-bold text-xl pb-4">Transferable Record Owner</div>
      <div className="flex my-4 items-center sm:flex-row flex-col">
        <div className="w-full sm:w-3/12 px-0 sm:px-4 sm:text-right text-grey-800 mb-2 sm:mb-0">
          Owner
        </div>
        <div className="w-full flex sm:w-8/12">
          <input
            data-testid="transferable-record-beneficiary-input"
            className="w-full h-10 rounded-none border border-solid border-grey-300 mr-2"
            value={beneficiaryAddress}
            type="text"
            onChange={(e) => setBeneficiaryAddress(e.target.value)}
          />
          <ButtonIcon
            className="bg-orange text-white hover:bg-orange-600"
            onClick={() => onOverlayHandler(setBeneficiaryAddress)}
          >
            <Book />
          </ButtonIcon>
        </div>
      </div>
      <div className="flex my-4 items-center sm:flex-row flex-col">
        <div className="w-full sm:w-3/12 px-0 sm:px-4 sm:text-right text-grey-800 mb-2 sm:mb-0">
          Holder
        </div>
        <div className="w-full flex sm:w-8/12">
          <input
            data-testid="transferable-record-holder-input"
            className="w-full  h-10 rounded-none border border-solid border-grey-300 mr-2"
            value={holderAddress}
            type="text"
            onChange={(e) => setHolderAddress(e.target.value)}
          />
          <ButtonIcon
            className="bg-orange text-white hover:bg-orange-600"
            onClick={() => onOverlayHandler(setHolderAddress)}
          >
            <Book />
          </ButtonIcon>
        </div>
      </div>
    </div>
  );
};
