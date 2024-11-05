import { InodeSearchBody, User } from '../types';
import job from '#lib/redis/job';

import { searchWorker } from '../../worker/index';

export default async function search(user: User, body: InodeSearchBody) {
  const jobId = await job.create();

  void searchWorker.run({ user, body, jobId }, { name: 'search' });

  return {
    jobId,
  };
}
