import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState, useRef, useEffect, useCallback } from "react";
import ReactTooltip from "react-tooltip";
import { useConfigContext } from "../../../common/context/config";
import { FormTemplate } from "../../../types";
import { validateDns, getIssuerAddress, getIssuerLocation } from "../../../utils";
import { checkDID, checkOwnership } from "../../../services/publishing/prechecks";

interface FormSelectProps {
  id: string;
  form: FormTemplate;
  onAddForm: () => void;
}

export const FormSelect: FunctionComponent<FormSelectProps> = ({ id, form, onAddForm, ...props }) => {
  const { config } = useConfigContext();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isValidDns, setIsValidDns] = useState<boolean>(true);
  const [isValidOwner, setIsValidOwner] = useState<boolean>(true);
  const [isValidEntry, setIsValidEntry] = useState<boolean>(true);
  const refButton = useRef<HTMLDivElement>(null);

  const handleForm = async (): Promise<void> => {
    if (isValidEntry) {
      onAddForm();
    } else {
      ReactTooltip.show(refButton.current as unknown as Element);
    }
  };

  const dnsCheck = useCallback(async () => {
    if (config?.network === "local") {
      setIsValidDns(true); // for local e2e to pass, skip dns validate + set valid
    } else {
      const isDnsValidated = await validateDns(form);
      setIsValidDns(isDnsValidated);
    }
  }, [config, form]);

  const ownershipCheck = useCallback(async () => {
    const wallet = config?.wallet;
    const contractAddress = getIssuerAddress(form.defaults);
    const isDID = checkDID(form.defaults);
    if (isDID) {
      setIsValidOwner(true);
      return;
    }
    const contractType = form?.type;
    if (config?.network === "local") {
      setIsValidOwner(true); // for local e2e to pass, skip ownership validate + set valid
    } else if (contractAddress != undefined && wallet != undefined) {
      const valid = await checkOwnership(contractType, contractAddress, wallet);
      setIsValidOwner(valid);
    }
  }, [config, form]);

  const checkValidity = useCallback(async () => {
    setIsValidEntry(isValidDns && isValidOwner);
    const errorMessage: string[] = [];
    if (!isValidDns) {
      const contractAddress = getIssuerAddress(form.defaults);
      errorMessage.push(
        `The contract address ${contractAddress} could not be found on ${getIssuerLocation(
          form.defaults
        )} DNS TXT records.`
      );
    }
    if (!isValidOwner) {
      const contractAddress = getIssuerAddress(form.defaults);
      const address = await config?.wallet?.getAddress();
      errorMessage.push(`The contract ${contractAddress} does not belong to ${address}.`);
    }
    if (errorMessage.length > 0) {
      setErrorMsg(errorMessage.join("<br />"));
    }
  }, [isValidDns, isValidOwner, form, config]);

  useEffect(() => {
    dnsCheck();
    // ownershipCheck();
    checkValidity();
  }, [dnsCheck, ownershipCheck, checkValidity]);

  return (
    <>
      <div ref={refButton} data-tip data-for={`tooltip-${id}`} data-testid="tooltip-form-select">
        <Button
          className={`bg-white w-11/12 h-full p-4 leading-5 ${
            isValidEntry === false ? "text-cloud-300 bg-cloud-100" : "text-cerulean hover:bg-cloud-100"
          }`}
          onClick={() => handleForm()}
          {...props}
        >
          {form.name}
        </Button>
      </div>
      <ReactTooltip
        className="max-w-xs break-words"
        id={`tooltip-${id}`}
        multiline={true}
        place={`bottom`}
        type="dark"
        effect="solid"
        getContent={() => {
          return errorMsg;
        }}
      />
    </>
  );
};
