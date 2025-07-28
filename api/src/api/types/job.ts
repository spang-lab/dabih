type JobStatus = 'running' | 'complete' | 'failed';

export interface Job {
  jobId: string;
  status: JobStatus;
}
