import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState, useRef, useEffect, useCallback } from "react";
import ReactTooltip from "react-tooltip";
import { useConfigContext } from "../../../common/context/config";
import { FormTemplate } from "../../../types";
import { validateDns, getIssuerLocation, getIssuerAddress } from "../../../utils";
import { checkOwnership } from "../../../services/publishing/prechecks"

interface FormSelectProps {
  id: string;
  form: FormTemplate;
  onAddForm: () => void;
}

export const FormSelect: FunctionComponent<FormSelectProps> = ({ id, form, onAddForm, ...props }) => {
  const { config } = useConfigContext();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isValidDns, setIsValidDns] = useState<boolean>();
  const [isValidOwner, setIsValidOwner] = useState<boolean>();
  const refButton = useRef<HTMLDivElement>(null);

  const handleForm = async (): Promise<void> => {
    if (isValidDns) {
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
      if (!isDnsValidated) {
        setErrorMsg(`The contract address could not be found on ${getIssuerLocation(form.defaults)} DNS TXT records.`);
      }
      setIsValidDns(isDnsValidated);
    }
  }, [config, form]);

  const ownershipCheck = useCallback(async () => {
    const wallet = config?.wallet;
    const contractAddress = getIssuerAddress(form.defaults);
    const contractType = form?.type;
    setIsValidOwner(false)
    if (config?.network === "local") {
      setIsValidOwner(true); // for local e2e to pass, skip dns validate + set valid
    }else if(contractAddress != undefined && wallet != undefined){
      const valid = await checkOwnership(contractType, contractAddress, wallet);
      setIsValidOwner(valid);
    }
    
    const address = await wallet?.getAddress();
    if (!isValidOwner) {
      setErrorMsg(`The contract ${contractAddress} does not belong to ${address}`);
    }
  }, [config, form]);

  useEffect(() => {
    dnsCheck();
    ownershipCheck();
  }, [dnsCheck, ownershipCheck]);

  return (
    <>
      <div ref={refButton} data-tip data-for={`tooltip-${id}`} data-testid="tooltip-form-select">
        <Button
          className={`bg-white w-11/12 h-full p-4 leading-5 ${
            isValidDns === false ? "text-cloud-300 bg-cloud-100" : "text-cerulean hover:bg-cloud-100"
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
        data-multiline={true}
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
