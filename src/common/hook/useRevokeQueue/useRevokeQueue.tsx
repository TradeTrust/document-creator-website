import { useState } from "react";
import { getLogger } from "../../../utils/logger";
import { Config, FailedJobErrors, RevokingJob, WrappedDocument } from "../../../types";
import { revokeDocumentJob } from "../../../services/revoking";
import { RevokeState } from "../../../constants/RevokeState";
import { getRevokingJobs } from "./utils/revoke";

const { stack } = getLogger("useRevokeQueue");

interface FailedJob {
  index: number;
  error: Error;
}

export const useRevokeQueue = (
  config: Config,
  documents: any[]
): {
  error?: Error;
  revokeState: RevokeState;
  revoke: () => void;
  revokedDocuments: WrappedDocument[];
  failedRevokedDocuments: FailedJobErrors[];
  pendingRevokeDocuments: WrappedDocument[];
} => {
  const [error, setError] = useState<Error>();
  const [revokeState, setRevokeState] = useState<RevokeState>(RevokeState.UNINITIALIZED);
  const [jobs, setJobs] = useState<RevokingJob[]>([]);
  const [pendingJobIndex, setPendingJobIndex] = useState<number[]>([]);
  const [failedJob, setFailedJob] = useState<FailedJob[]>([]);
  const [completedJobIndex, setCompletedJobIndex] = useState<number[]>([]);

  const revokedDocuments = completedJobIndex.reduce(
    (acc, curr) => [...acc, ...jobs[curr].documents],
    [] as WrappedDocument[]
  );

  const failedRevokedDocuments = failedJob.map((job) => {
    return {
      documents: jobs[job.index].documents,
      error: job.error,
    };
  });

  const pendingRevokeDocuments = pendingJobIndex.reduce(
    (acc, curr) => [...acc, ...jobs[curr].documents],
    [] as WrappedDocument[]
  );

  const revoke = async (): Promise<void> => {
    try {
      const completedJobsIndexes: number[] = [];
      const failedJobs: FailedJob[] = [];

      setRevokeState(RevokeState.INITIALIZED);
      const nonce = await config.wallet.getTransactionCount();
      const revokingJobs = await getRevokingJobs(documents, nonce);
      setJobs(revokingJobs);
      const pendingJobs = new Set(revokingJobs.map((job, index) => index));
      setPendingJobIndex(Array.from(pendingJobs));
      const allJobs = revokingJobs.map(async (job, index) => {
        try {
          const wallet = config.wallet;
          await revokeDocumentJob(job, wallet);
          completedJobsIndexes.push(index);
          setCompletedJobIndex(completedJobsIndexes);
        } catch (e) {
          failedJobs.push({
            index: index,
            error: e,
          });
          setFailedJob(failedJobs);
          stack(e);
          throw e;
        } finally {
          pendingJobs.delete(index);
          setPendingJobIndex(Array.from(pendingJobs));
        }
      });
      setRevokeState(RevokeState.PENDING);
      await Promise.allSettled(allJobs);
      setCompletedJobIndex(completedJobsIndexes);
      setFailedJob(failedJobs);
      setRevokeState(RevokeState.CONFIRMED);
    } catch (e) {
      stack(e);
      setError(e);
      setRevokeState(RevokeState.ERROR);
    }
  };

  return {
    revoke,
    revokeState,
    error,
    revokedDocuments,
    failedRevokedDocuments,
    pendingRevokeDocuments,
  };
};
