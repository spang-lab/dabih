import redis from '#lib/redis';
import crypto from '#crypto';

type JobStatus = 'running' | 'complete' | 'failed';

async function create(sub: string) {
  const jobId = await crypto.random.getToken(10);
  const jobKey = `job:${jobId}:meta`;
  await redis.hSet(jobKey, {
    status: 'running',
    sub,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return jobId;
}

async function list() {
  const keys = await redis.keys('job:*:meta');
  const jobIds = keys.map((key) => key.split(':')[1]);
  const jobs = await Promise.all(jobIds.map(getMeta));
  return jobs;
}

async function complete(jobId: string) {
  const jobKey = `job:${jobId}:meta`;
  await redis.hSet(jobKey, {
    status: 'complete',
    updatedAt: Date.now(),
  });
}

async function touch(jobId: string) {
  const jobKey = `job:${jobId}:meta`;
  await redis.hSet(jobKey, {
    updatedAt: Date.now(),
  });
}

async function addResults(jobId: string, json: string | string[]) {
  const jobKey = `job:${jobId}:data`;
  await redis.rPush(jobKey, json);
  await touch(jobId);
}

async function getMeta(jobId: string) {
  const jobKey = `job:${jobId}:meta`;
  const meta = await redis.hGetAll(jobKey);
  return {
    jobId,
    status: meta.status as JobStatus,
    sub: meta.sub,
    createdAt: parseInt(meta.createdAt, 10),
    updatedAt: parseInt(meta.updatedAt, 10),
  };
}

async function fetchResults(jobId: string, sub: string) {
  const jobKey = `job:${jobId}:data`;
  const meta = await getMeta(jobId);

  if (meta.sub !== sub) {
    throw new Error('Unauthorized');
  }

  const results = await redis
    .multi()
    .lRange(jobKey, 0, 99)
    .lTrim(jobKey, 100, -1)
    .exec();
  const entries = results[0] as string[];
  await touch(jobId);

  return {
    data: entries,
    ...meta,
  };
}

async function remove(jobId: string) {
  const jobKey = `job:${jobId}:meta`;
  await redis.del(jobKey);

  const dataKey = `job:${jobId}:data`;
  await redis.del(dataKey);
}

const job = {
  create,
  complete,
  list,
  addResults,
  getMeta,
  fetchResults,
  remove,
};
export default job;
