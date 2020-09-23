import React, { FunctionComponent, ReactElement } from "react";
import { CheckCircle, XCircle } from "react-feather";
import { useConfigContext } from "../../../../common/context/config";
import { useFormsContext } from "../../../../common/context/forms";
import { WrappedDocument } from "../../../../types";
import { Button } from "../../../UI/Button";
import { PublishLoader } from "../../../UI/PublishLoader";
import { Title } from "../../../UI/Title";

interface PublishTitle {
  publishState: string;
  publishedDocuments: WrappedDocument[];
}

export const PublishTitle: FunctionComponent<PublishTitle> = ({
  publishState,
  publishedDocuments,
}) => {
  const { setConfig } = useConfigContext();
  const { setForms, setActiveFormIndex } = useFormsContext();

  const createAnotherDoc = (): void => {
    setForms([]);
    setActiveFormIndex(undefined);
  };

  const onDone = (): void => {
    setForms([]);
    setActiveFormIndex(undefined);
    setConfig(undefined);
  };

  const getDisplayTitle = (): ReactElement => {
    switch (publishState) {
      case "PENDING_CONFIRMATION":
        return (
          <>
            <div className="h-6 w-6 mr-2">
              <PublishLoader />
            </div>
            Publishing document(s)...
          </>
        );

      case "CONFIRMED":
        if (publishedDocuments.length > 0) {
          return (
            <>
              <CheckCircle className="mr-2 text-teal" />
              Document(s) issued successfully
            </>
          );
        } else {
          return (
            <>
              <XCircle className="mr-2 text-red" />
              Document(s) failed to issue
            </>
          );
        }

      default:
        return <>Please wait while we prepare your document(s)</>;
    }
  };

  return (
    <>
      <Title className="flex items-center mb-8">{getDisplayTitle()}</Title>
      {publishState === "CONFIRMED" && (
        <div>
          <Button className="bg-white text-orange px-4 py-3 mb-6 mr-4" onClick={createAnotherDoc}>
            Create another Document
          </Button>
          <Button
            className="bg-orange text-white self-end py-3 px-4 mb-6"
            data-testid="form-logout-button"
            onClick={onDone}
          >
            Logout
          </Button>
        </div>
      )}
    </>
  );
};
