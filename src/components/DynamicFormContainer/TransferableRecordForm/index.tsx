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
      <div>Beneficiary</div>
      <input value={beneficiaryAddress} onChange={(e) => setBeneficiaryAddress(e.target.value)} />
      <div>Holder</div>
      <input value={holderAddress} onChange={(e) => setHolderAddress(e.target.value)} />
    </div>
  );
};
