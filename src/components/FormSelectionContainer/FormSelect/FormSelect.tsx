import { Button, LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { useConfigContext } from "../../../common/context/config";
import { checkOwnership, checkDID } from "../../../services/prechecks";
import { validateDns } from "../../../services/prechecks";
import { FormTemplate } from "../../../types";
import { getIssuerAddress, getIssuerLocation } from "../../../utils";

interface FormSelectProps {
  id: string;
  form: FormTemplate;
  onAddForm: () => void;
}

export const FormSelect: FunctionComponent<FormSelectProps> = ({ id, form, onAddForm, ...props }) => {
  const { config } = useConfigContext();
  const [tooltipMsg, setTooltipMsg] = useState<string | null>(null);
  const [isValidEntry, setIsValidEntry] = useState<boolean>();
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const refButton = useRef<HTMLDivElement>(null);

  const dnsCheck = async (): Promise<boolean> => {
    if (config?.network === "local") {
      return true; // for local e2e to pass, skip dns validate + set valid
    } else {
      const isDnsValidated = await validateDns(form);
      return isDnsValidated;
    }
  };

  const ownershipCheck = async (): Promise<boolean> => {
    const wallet = config?.wallet;
    const contractAddress = getIssuerAddress(form.defaults);
    const isDID = checkDID(form.defaults);
    const contractType = form?.type;
    if (config?.network === "local") {
      return true; // for local e2e to pass, skip ownership validate + set valid
    } else if (isDID) {
      return true;
    } else if (contractAddress !== undefined && wallet !== undefined) {
      const valid = await checkOwnership(contractType, contractAddress, wallet);
      return valid;
    }
    return false;
  };

  const checkValidity = async (isValidDns: boolean, isValidOwner: boolean) => {
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
      setTooltipMsg(errorMessage.join(" "));
      ReactTooltip.show(refButton.current as unknown as Element);
    } else {
      setTooltipMsg(null);
    }
    setLoadingState(false);
  };

  useEffect(() => {
    if (isValidEntry) {
      onAddForm();
    }
  }, [isValidEntry, onAddForm]);

  const handleForm = async (): Promise<void> => {
    if (isValidEntry === undefined) {
      setLoadingState(true);
      setTooltipMsg("Loading...");
      const validDns = await dnsCheck();
      const validOwnership = await ownershipCheck();
      checkValidity(validDns, validOwnership);
    } else if (!isValidEntry) {
      ReactTooltip.show(refButton.current as unknown as Element);
    } else {
      onAddForm();
    }
  };

  return (
    <>
      <div ref={refButton} data-tip data-for={`tooltip-${id}`} data-testid="tooltip-form-select">
        <Button
          className={`bg-white w-11/12 h-full p-4 leading-5 ${
            isValidEntry === false || loadingState === true
              ? "text-cloud-300 bg-cloud-100"
              : "text-cerulean hover:bg-cloud-100"
          }`}
          onClick={() => handleForm()}
          {...props}
        >
          {loadingState ? (
            <div className="flex flex-col flex-wrap">
              <div>{form.name}</div>
              <LoaderSpinner className="content-center self-center mt-1" />
            </div>
          ) : (
            form.name
          )}
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
          return tooltipMsg;
        }}
      />
    </>
  );
};
