import { LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent, ReactElement } from "react";
import { CheckCircle, XCircle } from "react-feather";
import { QueueState, QueueType } from "../../../constants/QueueState";
import { WrappedDocument } from "../../../types";
import { Title } from "../../UI/Title";

interface ProcessDocumentTitle {
  queueState: QueueState;
  documents: WrappedDocument[];
  type: QueueType;
}

export const ProcessDocumentTitle: FunctionComponent<ProcessDocumentTitle> = ({ queueState, documents, type }) => {
  const isIssuingFlow = type === QueueType.ISSUE;
  const getDisplayTitle = (): ReactElement => {
    switch (queueState) {
      case QueueState.PENDING:
        return (
          <>
            <LoaderSpinner className="mr-2" width="24px" primary="#00cbbc" secondary="#e2e8f0" />
            {`${isIssuingFlow ? "Publishing " : "Revoking"} document(s)...`}
          </>
        );

      case QueueState.CONFIRMED:
        if (documents.length > 0) {
          return (
            <>
              <CheckCircle className="mr-2 text-turquoise-300" />
              {`Document(s) ${isIssuingFlow ? "issued" : "revoked"} successfully`}
            </>
          );
        } else {
          return (
            <>
              <XCircle className="mr-2 text-red-500" />
              {`Document(s) failed to ${isIssuingFlow ? "issue" : "revoke"}`}
            </>
          );
        }

      case QueueState.INITIALIZED:
      default:
        return <>Please wait while we prepare your document(s)</>;
    }
  };

  return (
    <Title className="flex items-center mb-8" data-testid="title">
      {getDisplayTitle()}
    </Title>
  );
};
