import { User } from '../types';
import job from '#lib/redis/job';
import { NotFoundError } from '../errors';

export default async function searchCancel(user: User, jobId: string) {
  const { sub } = user;
  const meta = await job.getMeta(jobId);
  if (!meta || meta.sub !== sub) {
    throw new NotFoundError(`Job not found for user ${sub}`);
  }
  await job.remove(jobId);
}
