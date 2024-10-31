import Piscina from 'piscina';
import { isMainThread } from 'worker_threads';

import { initRedis } from '#lib/redis';
import dbg from '#lib/dbg';
import { InodeSearchBody, User } from 'src/api/types';

if (isMainThread) {
  const piscina = new Piscina({
    filename: import.meta.filename,
  });
  module.exports = piscina;
} else {
  async function initalize() {
    await initRedis();
  }

  async function search(user: User, body: InodeSearchBody, jobId: string) {
    dbg(user, body, jobId);

    return;
  }
  module.exports = { initalize, search };
}
