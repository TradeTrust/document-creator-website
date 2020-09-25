import { ContractFunctionState } from "@govtechsg/ethers-contract-hook";
import { useState } from "react";
import { publishJob } from "../../../services/publishing";
import { Config, FailedJobErrors, FormEntry, PublishingJob, WrappedDocument } from "../../../types";
import { getLogger } from "../../../utils/logger";
import { uploadToStorage } from "../../API/storageAPI";
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
  error?: Error;
  publishState: string;
  publish: () => void;
  publishedDocuments: WrappedDocument[];
  failedPublishedDocuments: FailedJobErrors[];
  pendingPublishDocuments: WrappedDocument[];
} => {
  const [error, setError] = useState<Error>();
  const [publishState, setPublishState] = useState<ContractFunctionState>("UNINITIALIZED");
  const [jobs, setJobs] = useState<PublishingJob[]>([]);
  const [completedJobIndex, setCompletedJobIndex] = useState<number[]>([]);
  const [failedJob, setFailedJob] = useState<FailedJob[]>([]);
  const [pendingJobIndex, setPendingJobIndex] = useState<number[]>([]);

  const publishedDocuments = completedJobIndex.reduce((acc, curr) => {
    const documentsIssuesInJob = jobs[curr].documents;
    return [...acc, ...documentsIssuesInJob];
  }, [] as WrappedDocument[]);

  const failedPublishedDocuments = failedJob.map((job) => {
    return {
      documents: jobs[job.index].documents,
      error: job.error,
    };
  });

  const pendingPublishDocuments = pendingJobIndex.reduce(
    (acc, curr) => [...acc, ...jobs[curr].documents],
    [] as WrappedDocument[]
  );

  const publish = async (): Promise<void> => {
    try {
      // Cannot use setCompletedJobIndex here as async update does not with the promise race
      const completedJobs: number[] = [];
      const failedJobs: FailedJob[] = [];

      setPublishState("INITIALIZED");
      const nonce = await config.wallet.getTransactionCount();
      const publishingJobs = await getPublishingJobs(formEntries, config, nonce);
      setJobs(publishingJobs);
      const pendingJobs = new Set(publishingJobs.map((job, index) => index));
      setPendingJobIndex(Array.from(pendingJobs));
      const deferredJobs = publishingJobs.map(async (job, index) => {
        try {
          await publishJob(job, config.wallet);
          const uploadDocuments = job.documents.map(async (doc) => {
            if (config.documentStorage === undefined) return;
            await uploadToStorage(doc, config.documentStorage);
          });
          await Promise.all(uploadDocuments);
          completedJobs.push(index);
          setCompletedJobIndex(completedJobs);
        } catch (e) {
          failedJobs.push({
            index: index,
            error: e,
          });
          setFailedJob(failedJobs);
          stack(e);
          throw e; // Re-throwing error to preserve stack when Promise.allSettled resolves
        } finally {
          pendingJobs.delete(index);
          setPendingJobIndex(Array.from(pendingJobs));
        }
      });
      setPublishState("PENDING_CONFIRMATION");
      await Promise.allSettled(deferredJobs);
      setCompletedJobIndex(completedJobs);
      setFailedJob(failedJobs);
      setPublishState("CONFIRMED");
    } catch (e) {
      stack(e);
      setError(e);
      setPublishState("ERROR");
    }
  };

  return {
    publish,
    publishState,
    error,
    publishedDocuments,
    failedPublishedDocuments,
    pendingPublishDocuments,
  };
};
