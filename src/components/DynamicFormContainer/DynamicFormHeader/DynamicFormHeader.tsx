import { Button, OverlayContext, ProgressBar, Textual } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useContext } from "react";
import { Card } from "../../UI/Card";
import { IssueOrRevokeSelector } from "../../UI/IssueOrRevokeSelector";
import { Wrapper } from "../../UI/Wrapper";
import { DocumentSelector } from "../DocumentSelector";
import { GasEstimation } from "./GasEstimation";
import { useGasSelectorContext } from "../../../common/context/network";
import { formatUnits } from "ethers/lib/utils";

interface DynamicFormHeaderProps {
  onBackToFormSelection: () => void;
  onNewForm: () => void;
  onFormSubmit: () => void;
  validateCurrentForm: () => boolean;
  closePreviewMode: () => void;
}

// const GasSelectionGuide: FunctionComponent<{ GasValue: string }> = (GasValue: string) => {
//   // TODO: use Confirmation Content
//   return (
//     <Textual title={"Gas Estimation"}>
//       <div>{`Final Priority Gas Value: ${GasValue}`}</div>
//     </Textual>
//   );
// };

export const DynamicFormHeader: FunctionComponent<DynamicFormHeaderProps> = ({
  onBackToFormSelection,
  onNewForm,
  onFormSubmit,
  validateCurrentForm,
  closePreviewMode,
}) => {
  // const { gasSpeed, networkGasInformation } = useGasSelectorContext();
  const { showOverlay, closeOverlay } = useContext(OverlayContext);
  const onFormSubmission = () => {
    // let gasPriceString = "";
    // if (!networkGasInformation) onFormSubmit();
    // if (networkGasInformation) {
    //   for (let i = 0; i < networkGasInformation.length; i++) {
    //     if (gasSpeed === networkGasInformation[i].speed) {
    //       const gasPrice = networkGasInformation[i].maxPriorityFeePerGas;
    //       gasPriceString = formatUnits(gasPrice, "gwei");
    //     }
    //   }
    //   const openModal = () => {
    //     showOverlay(
    //       <Textual title={"Gas Estimation"}>
    //         <div>{`Current Priority Gas Value: ${gasPriceString}`}</div>
    //         <Button
    //           className="bg-white text-cerulean-500 hover:bg-cloud-100 mr-4"
    //           onClick={closeOverlay}
    //           data-testid="close-overlay"
    //         >
    //           Cancel
    //         </Button>
    //         <Button
    //           className="bg-cerulean-500 text-white hover:bg-cerulean-800"
    //           onClick={onFormSubmit}
    //           data-testid="form-submit-button"
    //         >
    //           Confirm
    //         </Button>
    //       </Textual>
    //     );
    //   };
    //   openModal();
    // }
  };
  return (
    <Wrapper className="mb-8">
      <Card
        title={
          <div className="md:flex justify-between items-center">
            <IssueOrRevokeSelector />
            <Button
              data-testid="clear-all-button"
              className="mt-2 md:mt-0 bg-white text-cerulean-500 hover:bg-cloud-100"
              onClick={onBackToFormSelection}
            >
              Clear All
            </Button>
          </div>
        }
      >
        <ProgressBar step={2} totalSteps={3} />
        <div>
          <GasEstimation />
        </div>
        <h3 data-testid="fill-form-title" className="my-8">
          Fill and Preview Form
        </h3>
        <div className="md:flex justify-between items-start">
          <div className="flex flex-col">
            <DocumentSelector validateCurrentForm={validateCurrentForm} closePreviewMode={closePreviewMode} />
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              className="bg-white text-cerulean-500 hover:bg-cloud-100 mr-4"
              onClick={onNewForm}
              data-testid="add-new-button"
            >
              Add New
            </Button>
            <Button
              className="bg-cerulean-500 text-white hover:bg-cerulean-800"
              onClick={onFormSubmission}
              data-testid="form-submit-button"
            >
              Issue Document(s)
            </Button>
          </div>
        </div>
      </Card>
    </Wrapper>
  );
};
