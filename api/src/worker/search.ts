import { initRedis } from '#lib/redis';
import dbg from '#lib/dbg';
import { InodeSearchBody, User } from 'src/api/types';
import job from '#lib/redis/job';

async function initalize() {
  await initRedis();
}

export default initalize();

export async function search({
  user,
  body,
  jobId,
}: {
  user: User;
  body: InodeSearchBody;
  jobId: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log(jobId);

  await job.complete(jobId);
  dbg(user, body, jobId);

  return;
}
