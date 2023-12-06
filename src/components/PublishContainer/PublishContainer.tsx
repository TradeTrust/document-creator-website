import { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../common/context/config";
import { useFormsContext } from "../../common/context/forms";
import { ProcessDocumentScreen } from "../ProcessDocumentScreen";
import { QueueType } from "../../constants/QueueState";
import { PriorityFeeContext, SelectedFee, useGasSelectorContext } from "../../common/context/network";
import { NetworkGasInformation } from "../../types";

export const PublishContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  const { forms, currentForm, setForms, setActiveFormIndex } = useFormsContext();
  const { gasSpeed, networkGasInformation } = useGasSelectorContext();

  if (!config) return <Redirect to="/" />;
  if (!currentForm) return <Redirect to="/forms-selection" />;

  const onCreateAnotherDocument = (): void => {
    setForms([]);
    setActiveFormIndex(undefined);
  };

  const gasPrice: SelectedFee = {};

  if (networkGasInformation && gasSpeed) {
    const { low, market, agressive } = networkGasInformation.priorityFee;
    gasPrice.baseFee = networkGasInformation.baseFee;
    switch (gasSpeed) {
      case "low":
        gasPrice.maxFee = low.maxFee;
        gasPrice.priorityFee = low.priorityFee;
        break;
      case "market":
        gasPrice.maxFee = market.maxFee;
        gasPrice.priorityFee = market.priorityFee;
        break;
      case "agressive":
        gasPrice.maxFee = agressive.maxFee;
        gasPrice.priorityFee = agressive.priorityFee;
        break;
      default:
        break;
    }
  }

  return (
    <ProcessDocumentScreen
      config={config}
      forms={forms}
      processAnotherDocument={onCreateAnotherDocument}
      type={QueueType.ISSUE}
      gasPrice={gasPrice}
    />
  );
};
