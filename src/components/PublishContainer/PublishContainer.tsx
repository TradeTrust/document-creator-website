import { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../common/context/config";
import { useFormsContext } from "../../common/context/forms";
import { ProcessDocumentScreen } from "../ProcessDocumentScreen";
import { QueueType } from "../../constants/QueueState";
import { useGasSelectorContext } from "../../common/context/network";
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

  let gasPrice: NetworkGasInformation;
  if (networkGasInformation) {
    for (let i = 0; i < networkGasInformation.length; i++) {
      if (gasSpeed === networkGasInformation[i].speed) {
        gasPrice = networkGasInformation[i];
      }
    }
  }

  return (
    <ProcessDocumentScreen
      config={config}
      forms={forms}
      processAnotherDocument={onCreateAnotherDocument}
      type={QueueType.ISSUE}
      // gasPrice={gasPrice}
    />
  );
};
