import Piscina from 'piscina';
import { isMainThread } from 'worker_threads';

import { initRedis } from '#lib/redis';
import dbg from '#lib/dbg';
import { InodeSearchBody, User } from 'src/api/types';

let exported = null;

if (isMainThread) {
  console.log(import.meta.filename);
  exported = new Piscina({
    filename: import.meta.filename,
  });
} else {
  async function initalize() {
    await initRedis();
  }

  async function search(user: User, body: InodeSearchBody, jobId: string) {
    dbg(user, body, jobId);

    return;
  }
  exported = { initalize, search };
}
export default exported;
