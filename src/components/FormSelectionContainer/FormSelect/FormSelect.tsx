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

export const FormSelect: FunctionComponent<FormSelectProps> = ({ id, form, onAddForm, ...props }) => {
  const { config } = useConfigContext();
  enum formStates {
    "initial",
    "pending",
    "success",
    "error:dns",
    "error:ownership",
    "error:both",
  }
  const [formStatus, setFormStatus] = useState<formStates>(formStates["initial"]);
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
    setFormStatus(formStates["pending"]);
    const isValidDns = await checkDns();
    const isValidOwner = await checkOwnership();

    if (!isValidDns || !isValidOwner) {
      if (!isValidDns && !isValidOwner) {
        setFormStatus(formStates["error:both"]);
      } else if (!isValidDns) {
        setFormStatus(formStates["error:dns"]);
      } else {
        setFormStatus(formStates["error:ownership"]);
      }
    } else {
      setFormStatus(formStates["success"]);
    }
  };

  useEffect(() => {
    if (formStatus === formStates["success"]) {
      onAddForm();
    }
  }, [formStatus, onAddForm, formStates]);

  const handleForm = async (): Promise<void> => {
    if (formStatus === formStates["initial"]) {
      checkValidity();
    } else if (formStatus === formStates["success"]) {
      onAddForm();
    } else {
      // Error or Pending Status
      ReactTooltip.show(refButton.current as unknown as Element);
    }
  };

  const isErrorState = (queryState: formStates) => {
    const bothError = queryState === formStates["error:both"];
    const isValidDns = !(queryState === formStates["error:dns"] || bothError);
    const isValidOwner = !(queryState === formStates["error:ownership"] || bothError);
    return bothError || !isValidDns || !isValidOwner;
  };

  const getTooltipMessage = () => {
    if (formStatus === formStates["pending"]) {
      return "Loading...";
    }
    const bothError = formStatus === formStates["error:both"];
    const isValidDns = !(formStatus === formStates["error:dns"] || bothError);
    const isValidOwner = !(formStatus === formStates["error:ownership"] || bothError);

    const errorMessage: string[] = [];

    if (!isValidDns) {
      errorMessage.push(`The contract could not be found on it's DNS TXT records`);
    }

    if (!isValidOwner) {
      if (errorMessage.length > 0) {
        errorMessage.push(`and does not belong to the wallet`);
      } else {
        errorMessage.push(`The contract does not belong to the wallet`);
      }
    }

    if (errorMessage.length > 0) {
      return errorMessage.join(" ") + ".";
    } else {
      return null;
    }
  };

  return (
    <>
      <div ref={refButton} data-tip data-for={`tooltip-${id}`} data-testid="tooltip-form-select">
        <Button
          className={`bg-white w-11/12 h-full p-4 leading-5 ${
            isErrorState(formStatus) || formStatus === formStates["pending"]
              ? "text-cloud-300 bg-cloud-100"
              : "text-cerulean hover:bg-cloud-100"
          }`}
          onClick={() => handleForm()}
          {...props}
        >
          {formStatus === formStates["pending"] ? (
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
