import { useState } from "react";
import { FormEntry, Config } from "../../../types";
import { getPublishingQueue } from "./utils/publish";
import { getDefaultProvider } from "ethers";
import { ContractFunctionState } from "@govtechsg/ethers-contract-hook";
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { DocumentStore } from "@govtechsg/document-store/src/contracts/DocumentStore";

interface WrappedDocument {
  fileName: string;
  data: any;
}

export const usePublishQueue = (
  config: Config,
  formEntries: FormEntry[]
): {
  error?: string;
  publishState: string;
  publish: () => void;
  wrappedDocuments: WrappedDocument[];
} => {
  const [error, setError] = useState<string>();
  const [publishState, setPublishState] = useState<ContractFunctionState>("UNINITIALIZED");
  const [wrappedDocuments, setWrappedDocuments] = useState<WrappedDocument[]>([]);

  config.wallet.connect(getDefaultProvider(config.network));

  const publish = () => {
    const publishQueue = getPublishingQueue(formEntries, config);
    const nextWrappedDocuments: WrappedDocument[] = [];
    publishQueue.forEach((queuedRequest) => {
      queuedRequest.documents.forEach((document, index) => {
        nextWrappedDocuments.push({
          data: document,
          fileName: queuedRequest.forms[index].fileName,
        });
      });
    });
    setWrappedDocuments(nextWrappedDocuments);

    const contracts: DocumentStore[] = publishQueue.map((queued) => {
      // Only document store can be used here for now
      return DocumentStoreFactory.connect(queued.contractAddress, config.wallet);
    });

    setPublishState("INITIALIZED");
    const deferredTransactions = contracts.map((contract, index) => {
      const merkleRoot = `0x${publishQueue[index].merkleRoot}`;
      return contract
        .issue(merkleRoot)
        .then((receipt) => receipt.wait())
        .catch((e) => {
          throw e;
        });
    });
    setPublishState("PENDING_CONFIRMATION");
    Promise.all(deferredTransactions)
      .then((transactions) => {
        console.log(transactions);
        setPublishState("CONFIRMED");
      })
      .catch((e) => {
        console.error(e);
        setError(e.message);
      });
  };

  return { publish, publishState, error, wrappedDocuments };
};
