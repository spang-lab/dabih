import { InodeSearchBody, User } from '../types';
import job from '#lib/redis/job';

import * as searchWorker from 'src/worker/search';

export default async function search(user: User, body: InodeSearchBody) {
  const jobId = await job.create();
  void searchWorker.run({ user, body, jobId });

  return {
    jobId,
  };
}
