import React, { FunctionComponent } from "react";
// import ReactTooltip from "react-tooltip";
// import { useConfigContext } from "../../../common/context/config";
// import { checkContractOwnership, checkDID, PreCheckStatus, PreCheckError } from "../../../services/prechecks";
// import { validateDns } from "../../../services/prechecks";
import { FormTemplate } from "../../../types";
// import { getIssuerAddress } from "../../../utils";

interface FormSelectProps {
  id: string;
  form: FormTemplate;
  onAddForm: () => void;
}

// const errorMsgDnsTxt = "The contract could not be found on it's DNS TXT records.";

// enum FormStatus {
//   "INITIAL",
//   "PENDING",
//   "ERROR",
//   "SUCCESS",
// }

export const FormSelect: FunctionComponent<FormSelectProps> = ({ form }) => {
  // const { config } = useConfigContext();

  // const [formErrors, setFormErrors] = useState<PreCheckError[]>([]);
  // const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.INITIAL);
  // const refButton = useRef<HTMLDivElement>(null);

  // const checkDns = async (): Promise<PreCheckStatus> => {
  //   if (config?.network === "local") {
  //     return "VALID"; // for local e2e to pass, skip dns validate + set valid
  //   } else {
  //     const isDnsValidated = await validateDns(form);
  //     if (isDnsValidated) {
  //       return "VALID";
  //     } else {
  //       return { type: "dns", message: errorMsgDnsTxt };
  //     }
  //   }
  // };

  // const checkOwnership = async (): Promise<PreCheckStatus> => {
  //   const isDID = checkDID(form.defaults);
  //   if (config?.network === "local") {
  //     return "VALID"; // for local e2e to pass, skip ownership validate + set valid
  //   } else if (isDID) {
  //     return "VALID"; // Assume DIDs are valid
  //   }
  //   const wallet = config?.wallet;
  //   const contractAddress = getIssuerAddress(form.defaults);

  //   if (contractAddress !== undefined && wallet !== undefined) {
  //     const contractType = form?.type;
  //     return await checkContractOwnership(contractType, contractAddress, wallet);
  //   }
  //   return { type: "config", message: "Contract Address or Wallet unspecified in Config" };
  // };

  // const checkValidity = async () => {
  //   setFormStatus(FormStatus.PENDING);
  //   const isValidDns = await checkDns();
  //   const isValidOwner = await checkOwnership();
  //   const preCheckErrors: PreCheckError[] = [];

  //   if (isValidDns !== "VALID") {
  //     preCheckErrors.push(isValidDns);
  //   }
  //   if (isValidOwner !== "VALID") {
  //     preCheckErrors.push(isValidOwner as PreCheckError);
  //   }
  //   const formState = preCheckErrors.length === 0 ? FormStatus.SUCCESS : FormStatus.ERROR;
  //   setFormStatus(formState);
  //   setFormErrors(preCheckErrors);
  // };

  // useEffect(() => {
  //   if (formStatus === FormStatus.SUCCESS) {
  //     onAddForm();
  //   }
  // }, [formStatus, onAddForm]);

  // const handleForm = async (): Promise<void> => {
  //   if (formStatus === FormStatus.INITIAL) {
  //     checkValidity();
  //   } else if (formStatus === FormStatus.ERROR) {
  //     ReactTooltip.show(refButton.current as unknown as Element);
  //   }
  // };

  // const getTooltipMessage = () => {
  //   if (formStatus === FormStatus.PENDING) {
  //     return "Loading...";
  //   }

  //   if (formErrors.length > 0) {
  //     return formErrors.map((error) => `${error.message}`).join(" ");
  //   } else {
  //     return null;
  //   }
  // };

  return (
    <>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md border border-gray-200 w-11/12 p-4">
        <div className="mb-4">
          <h1 className="font-bold text-base tracking-normal align-middle h-full py-4 leading-5 text-cerulean-500 hover:text-cerulean-800">
            {form.name}
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => console.log("Expand clicked")}
            className="absolute text-white mt-3 ml-3 z-10 flex items-center text-blue-600 hover:text-blue-800 font-medium bg-cloud-500 px-3 py-1 rounded-lg m-2 flex items-center justify-center"
          >
            <img src="/expand.svg" alt="Expand" />
            <span>Expand Preview</span>
          </button>
          <div
            className="relative bg-cerulean-50 border border-gray-200 rounded-xl overflow-hidden "
            style={{ height: "240px", minHeight: "240px" }}
          >
            <img
              src={form.img}
              alt="Certificate of Origin"
              className="absolute p-1"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
