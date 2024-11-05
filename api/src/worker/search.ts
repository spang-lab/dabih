import { initRedis } from '#lib/redis';
import dbg from '#lib/dbg';
import { InodeSearchBody, User } from 'src/api/types';

export async function initalize() {
  await initRedis();
}

export async function search(user: User, body: InodeSearchBody, jobId: string) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  dbg(user, body, jobId);

  return;
}
