import { ContractFunctionState } from "@govtechsg/ethers-contract-hook";
import { useState } from "react";
import { PUBLISH_STATE } from "../../../constants";
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
  const [publishState, setPublishState] = useState<ContractFunctionState>(
    PUBLISH_STATE.UNINITIALIZED
  );
  const [jobs, setJobs] = useState<PublishingJob[]>([]);
  const [completedJobIndex, setCompletedJobIndex] = useState<number[]>([]);
  const [failedJob, setFailedJob] = useState<FailedJob[]>([]);
  const [pendingPublishJobs, setPendingPublishJobs] = useState<PublishingJob[]>([]);
  const [jobsNotPendingIndex, setJobsNotPendingIndex] = useState<number[]>([]);

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

  const pendingPublishDocuments = pendingPublishJobs
    .filter((job, index) => {
      return jobsNotPendingIndex.indexOf(index) === -1;
    })
    .reduce((acc, curr) => {
      const documentsInPendingJobs = curr.documents;
      return [...acc, ...documentsInPendingJobs];
    }, [] as WrappedDocument[]);

  const publish = async (): Promise<void> => {
    try {
      // Cannot use setCompletedJobIndex here as async update does not with the promise race
      const completedJobs: number[] = [];
      const failedJobs: FailedJob[] = [];
      const jobsNotPending: number[] = [];
      setPublishState(PUBLISH_STATE.INITIALIZED);
      const nonce = await config.wallet.getTransactionCount();
      const publishingJobs = await getPublishingJobs(formEntries, config, nonce);
      setJobs(publishingJobs);
      setPendingPublishJobs(publishingJobs);
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
          jobsNotPending.push(index);
          setJobsNotPendingIndex(jobsNotPending);
        }
      });
      setPublishState(PUBLISH_STATE.PENDING_CONFIRMATION);
      await Promise.allSettled(deferredJobs);
      setCompletedJobIndex(completedJobs);
      setFailedJob(failedJobs);
      setPublishState(PUBLISH_STATE.CONFIRMED);
    } catch (e) {
      stack(e);
      setError(e);
      setPublishState(PUBLISH_STATE.ERROR);
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
