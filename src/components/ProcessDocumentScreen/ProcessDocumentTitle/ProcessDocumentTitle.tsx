import { LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent, ReactElement } from "react";
import { CheckCircle, XCircle } from "react-feather";
import { QueueState, QueueType } from "../../../constants/QueueState";
import { WrappedDocument } from "../../../types";
interface ProcessDocumentTitle {
  queueState: QueueState;
  documents: WrappedDocument[];
  type: QueueType;
}

export const ProcessDocumentTitle: FunctionComponent<ProcessDocumentTitle> = ({ queueState, documents, type }) => {
  const isIssuingFlow = type === QueueType.ISSUE;

  const titleText = (message: string): ReactElement => {
    return <span data-testid="process-title">{message}</span>;
  };

  const getDisplayTitle = (): ReactElement => {
    switch (queueState) {
      case QueueState.PENDING:
        return (
          <>
            <LoaderSpinner className="mr-2" width="24px" primary="#3B8CC5" />
            {titleText(`${isIssuingFlow ? "Publishing document(s)..." : "Revoking document..."}`)}
          </>
        );

      case QueueState.CONFIRMED:
        if (documents.length > 0) {
          return (
            <>
              <CheckCircle className="mr-2 text-teal-300 h-12 w-12 md:h-auto md:w-auto" />
              {titleText(`${isIssuingFlow ? "Document(s) issued" : "Document revoked"} successfully`)}
            </>
          );
        } else {
          return (
            <>
              <XCircle className="mr-2 text-rose h-12 w-12 md:h-auto md:w-auto" />
              {titleText(`${isIssuingFlow ? "Document(s) failed to issue" : "Document failed to revoke"}`)}
            </>
          );
        }

      case QueueState.ERROR:
        return (
          <>
            <XCircle className="mr-2 text-rose h-12 w-12 md:h-auto md:w-auto" />
            {titleText(`We have encountered an error`)}
          </>
        );

      case QueueState.INITIALIZED:
      default:
        return titleText(`Please wait while we prepare your ${isIssuingFlow ? "document(s)" : "document"}`);
    }
  };

  return (
    <h3 data-testid="process-document-title" className="flex items-center my-8">
      {getDisplayTitle()}
    </h3>
  );
};
