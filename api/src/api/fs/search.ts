import { InodeSearchBody, User } from '../types';
import job from '#lib/redis/job';

import { searchWorker } from '../../worker/index';

export async function searchStart(user: User, body: InodeSearchBody) {
  const jobId = await job.create();
  void searchWorker.run({ user, body, jobId }, { name: 'search' });
  return {
    jobId,
  };
}

export async function searchResults(user: User, jobId: string) {
  throw new Error('Not implemented');
}
