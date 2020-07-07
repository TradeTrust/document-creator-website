import React, { FunctionComponent } from "react";

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
  return (
    <div>
      <div className="text-grey-dark font-bold text-xl pb-4">Transferable Record Owner</div>
      <div className="border border-solid border-grey-lighter pb-3 rounded bg-lightgrey">
        <div className="flex my-4 items-center">
          <div className="w-full sm:w-3/12 px-0 sm:px-4 sm:text-right text-grey-dark">
            Beneficiary
          </div>
          <input
            data-testid="transferable-record-beneficiary-input"
            className="w-full sm:w-8/12 px-0 sm:px-2 h-10 rounded-none border border-solid border-grey-lighter"
            value={beneficiaryAddress}
            type="text"
            onChange={(e) => setBeneficiaryAddress(e.target.value)}
          />
        </div>
        <div className="flex my-4 items-center">
          <div className="w-full sm:w-3/12 px-0 sm:px-4 sm:text-right text-grey-dark">Holder</div>
          <input
            data-testid="transferable-record-holder-input"
            className="w-full sm:w-8/12 px-0 sm:px-2 h-10 rounded-none border border-solid border-grey-lighter"
            value={holderAddress}
            type="text"
            onChange={(e) => setHolderAddress(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
