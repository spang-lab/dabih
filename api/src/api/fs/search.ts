import { InodeSearchBody, User } from '../types';
import job from '#lib/redis/job';

export default async function search(user: User, body: InodeSearchBody) {
  const jobId = await job.create();

  throw new Error('Not implemented');

  return {
    jobId,
  };
}
