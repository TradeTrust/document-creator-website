import { Button, LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { useConfigContext } from "../../../common/context/config";
import { checkContractOwnership, checkDID, PreCheckStatus, PreCheckError } from "../../../services/prechecks";
import { validateDns } from "../../../services/prechecks";
import { FormTemplate } from "../../../types";
import { getIssuerAddress } from "../../../utils";
import { primary } from "../../../constants/styles";

interface FormSelectProps {
  id: string;
  form: FormTemplate;
  onAddForm: () => void;
}

const errorMsgDnsTxt = "The contract could not be found on it's DNS TXT records.";

enum FormStatus {
  "INITIAL",
  "PENDING",
  "ERROR",
  "SUCCESS",
}

export const FormSelect: FunctionComponent<FormSelectProps> = ({ id, form, onAddForm, ...props }) => {
  const { config } = useConfigContext();

  const [formErrors, setFormErrors] = useState<PreCheckError[]>([]);
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.INITIAL);
  const refButton = useRef<HTMLDivElement>(null);

  const checkDns = async (): Promise<PreCheckStatus> => {
    if (config?.network === "local") {
      return "VALID"; // for local e2e to pass, skip dns validate + set valid
    } else {
      const isDnsValidated = await validateDns(form);
      if (isDnsValidated) {
        return "VALID";
      } else {
        return { type: "dns", message: errorMsgDnsTxt };
      }
    }
  };

  const checkOwnership = async (): Promise<PreCheckStatus> => {
    const isDID = checkDID(form.defaults);
    if (config?.network === "local") {
      return "VALID"; // for local e2e to pass, skip ownership validate + set valid
    } else if (isDID) {
      return "VALID"; // Assume DIDs are valid
    }
    const wallet = config?.wallet;
    const contractAddress = getIssuerAddress(form.defaults);

    if (contractAddress !== undefined && wallet !== undefined) {
      const contractType = form?.type;
      return await checkContractOwnership(contractType, contractAddress, wallet);
    }
    return { type: "config", message: "Contract Address or Wallet unspecified in Config" };
  };

  const checkValidity = async () => {
    setFormStatus(FormStatus.PENDING);
    const isValidDns = await checkDns();
    const isValidOwner = await checkOwnership();
    const preCheckErrors: PreCheckError[] = [];

    if (isValidDns !== "VALID") {
      preCheckErrors.push(isValidDns);
    }
    if (isValidOwner !== "VALID") {
      preCheckErrors.push(isValidOwner as PreCheckError);
    }
    const formState = preCheckErrors.length === 0 ? FormStatus.SUCCESS : FormStatus.ERROR;
    setFormStatus(formState);
    setFormErrors(preCheckErrors);
  };

  useEffect(() => {
    if (formStatus === FormStatus.SUCCESS) {
      onAddForm();
    }
  }, [formStatus, onAddForm]);

  const handleForm = async (): Promise<void> => {
    if (formStatus === FormStatus.INITIAL) {
      checkValidity();
    } else if (formStatus === FormStatus.ERROR) {
      ReactTooltip.show(refButton.current as unknown as Element);
    }
  };

  const getTooltipMessage = () => {
    if (formStatus === FormStatus.PENDING) {
      return "Loading...";
    }

    if (formErrors.length > 0) {
      return formErrors.map((error) => `${error.message}`).join(" ");
    } else {
      return null;
    }
  };

  return (
    <>
      <div ref={refButton} data-tip data-for={`tooltip-${id}`} data-testid="tooltip-form-select">
        <Button
          className={`bg-white w-11/12 h-full p-4 leading-5 ${
            formStatus === FormStatus.PENDING || formStatus === FormStatus.ERROR
              ? "text-cloud-300 bg-cloud-100"
              : "text-cerulean-500 hover:text-cerulean-800 hover:bg-cloud-100"
          }`}
          onClick={() => handleForm()}
          {...props}
        >
          {formStatus === FormStatus.PENDING ? (
            <div className="flex flex-col flex-wrap">
              <h5>{form.name}</h5>
              <LoaderSpinner className="content-center self-center mt-1" primary={primary} />
            </div>
          ) : (
            <h5>{form.name}</h5>
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
        getContent={getTooltipMessage}
      />
    </>
  );
};
