import { Button, LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { useConfigContext } from "../../../common/context/config";
import { checkContractOwnership, checkDID } from "../../../services/prechecks";
import { validateDns } from "../../../services/prechecks";
import { FormTemplate } from "../../../types";
import { getIssuerAddress } from "../../../utils";

interface FormSelectProps {
  id: string;
  form: FormTemplate;
  onAddForm: () => void;
}

const errorMsgDns = "The contract could not be found on it's DNS TXT records.";
const errorDnsOwner = "The contract does not belong to the wallet.";

enum FormStates {
  "INITIAL",
  "PENDING",
  "ERROR",
  "SUCCESS",
}

interface FormErrors {
  type: "dns" | "ownership";
  message: string;
}

export const FormSelect: FunctionComponent<FormSelectProps> = ({ id, form, onAddForm, ...props }) => {
  const { config } = useConfigContext();

  const [errors, setErrors] = useState<FormErrors[]>([]);
  const [formStatus, setFormStatus] = useState<FormStates>(FormStates.INITIAL);
  const refButton = useRef<HTMLDivElement>(null);

  const checkDns = async (): Promise<boolean> => {
    if (config?.network === "local") {
      return true; // for local e2e to pass, skip dns validate + set valid
    } else {
      const isDnsValidated = await validateDns(form);
      return isDnsValidated;
    }
  };

  const checkOwnership = async (): Promise<boolean> => {
    const isDID = checkDID(form.defaults);
    if (config?.network === "local") {
      return true; // for local e2e to pass, skip ownership validate + set valid
    } else if (isDID) {
      return true; // Assume DIDs are valid
    }
    const wallet = config?.wallet;
    const contractAddress = getIssuerAddress(form.defaults);

    if (contractAddress !== undefined && wallet !== undefined) {
      const contractType = form?.type;
      const valid = await checkContractOwnership(contractType, contractAddress, wallet);
      return valid;
    }
    return false;
  };

  const checkValidity = async () => {
    setFormStatus(FormStates.PENDING);
    const isValidDns = await checkDns();
    const isValidOwner = await checkOwnership();

    if (!isValidDns || !isValidOwner) {
      if (!isValidDns && !isValidOwner) {
        setErrors([
          {
            type: "dns",
            message: errorMsgDns,
          },
          {
            type: "ownership",
            message: errorDnsOwner,
          },
        ]);
      } else if (!isValidDns) {
        setErrors([
          {
            type: "dns",
            message: errorMsgDns,
          },
        ]);
      } else if (!isValidOwner) {
        setErrors([
          {
            type: "ownership",
            message: errorDnsOwner,
          },
        ]);
      }
      setFormStatus(FormStates.ERROR);
    } else {
      setErrors([]);
      setFormStatus(FormStates.SUCCESS);
    }
  };

  useEffect(() => {
    if (formStatus === FormStates.SUCCESS) {
      onAddForm();
    }
  }, [formStatus, onAddForm]);

  const handleForm = async (): Promise<void> => {
    if (formStatus === FormStates.INITIAL) {
      checkValidity();
    } else if (formStatus === FormStates.ERROR) {
      ReactTooltip.show(refButton.current as unknown as Element);
    }
  };

  const getTooltipMessage = () => {
    if (formStatus === FormStates.PENDING) {
      return "Loading...";
    }

    if (errors.length > 0) {
      return errors.map((error) => `${error.message}`).join(" ");
    } else {
      return null;
    }
  };

  return (
    <>
      <div ref={refButton} data-tip data-for={`tooltip-${id}`} data-testid="tooltip-form-select">
        <Button
          className={`bg-white w-11/12 h-full p-4 leading-5 ${
            formStatus === FormStates.PENDING || formStatus === FormStates.ERROR
              ? "text-cloud-300 bg-cloud-100"
              : "text-cerulean hover:bg-cloud-100"
          }`}
          onClick={() => handleForm()}
          {...props}
        >
          {formStatus === FormStates.PENDING ? (
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
        getContent={getTooltipMessage}
      />
    </>
  );
};
