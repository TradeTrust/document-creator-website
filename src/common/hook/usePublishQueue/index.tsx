import { ContractFunctionState } from "@govtechsg/ethers-contract-hook";
import { useState } from "react";
import { publishJob } from "../../../services/publishing";
import { Config, FailedJobErrors, FormEntry, PublishingJob, WrappedDocument } from "../../../types";
import { getLogger } from "../../../utils/logger";
import { getPublishingJobs } from "./utils/publish";

const { stack } = getLogger("usePublishQueue");

interface FailedJob {
  index: number;
  error: Error;
}

export const usePublishQueue = (
  config: Config,
  formEntries: FormEntry[]
): {
  error?: string;
  publishState: string;
  publish: () => void;
  publishedDocuments: WrappedDocument[];
  failedPublishedDocuments: FailedJobErrors[];
} => {
  const [error, setError] = useState<string>();
  const [publishState, setPublishState] = useState<ContractFunctionState>("UNINITIALIZED");
  const [jobs, setJobs] = useState<PublishingJob[]>([]);
  const [completedJobIndex, setCompletedJobIndex] = useState<number[]>([]);
  const [failedJob, setFailedJob] = useState<FailedJob[]>([]);

  const publishedDocuments = completedJobIndex.reduce((acc, curr) => {
    const documentsIssuesInJob = jobs[curr].documents;
    return [...acc, ...documentsIssuesInJob];
  }, [] as WrappedDocument[]);

  const failedPublishedDocuments = failedJob.reduce((acc, curr) => {
    const formattedError = {
      documents: jobs[curr.index].documents,
      error: curr.error,
    };
    return [...acc, formattedError];
  }, [] as FailedJobErrors[]);

  const publish = async (): Promise<void> => {
    try {
      // Cannot use setCompletedJobIndex here as async update does not with the promise race
      const completedJobs: number[] = [];
      const failedJobs: FailedJob[] = [];
      setPublishState("INITIALIZED");
      const nonce = await config.wallet.getTransactionCount();
      const publishingJobs = getPublishingJobs(formEntries, config, nonce);
      setJobs(publishingJobs);
      const deferredJobs = publishingJobs.map((job, index) =>
        publishJob(job, config.wallet)
          .then(() => {
            completedJobs.push(index);
            setCompletedJobIndex(completedJobs);
          })
          .catch((e) => {
            failedJobs.push({
              index: index,
              error: e,
            });
            setFailedJob(failedJobs);
            stack(e);
            throw e; // Re-throwing error to preserve stack when Promise.allSettled resolves
          })
      );
      setPublishState("PENDING_CONFIRMATION");
      await Promise.allSettled(deferredJobs);
      setCompletedJobIndex(completedJobs);
      setFailedJob(failedJobs);
      setPublishState("CONFIRMED");
    } catch (e) {
      stack(e);
      setError(e.message);
      setPublishState("ERROR");
    }
  };

  return {
    publish,
    publishState,
    error,
    publishedDocuments,
    failedPublishedDocuments,
  };
};
