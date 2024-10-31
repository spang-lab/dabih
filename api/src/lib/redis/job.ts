import redis from '#lib/redis';
import crypto from '#crypto';

type JobStatus = 'running' | 'complete' | 'failed';

async function create() {
  const jobId = await crypto.random.getToken(10);
  const jobKey = `job:${jobId}:status`;
  await redis.set(jobKey, 'running');
  return jobId;
}

async function complete(jobId: string) {
  const jobKey = `job:${jobId}:status`;
  await redis.set(jobKey, 'complete');
}

async function addResult(jobId: string, json: string) {
  const jobKey = `job:${jobId}:data`;
  await redis.rPush(jobKey, json);
}

async function getStatus(jobId: string) {
  const jobKey = `job:${jobId}:status`;
  return redis.get(jobKey) as Promise<JobStatus>;
}

async function fetchResults(jobId: string) {
  const jobKey = `job:${jobId}:data`;
  const status = await getStatus(jobId);

  const results = await redis
    .multi()
    .lRange(jobKey, 0, 99)
    .lTrim(jobKey, 100, -1)
    .exec();
  const entries = results[0] as string[];

  return {
    data: entries,
    status,
  };
}

async function remove(jobId: string) {
  const jobKey = `job:${jobId}:status`;
  await redis.del(jobKey);
}

const job = {
  create,
  complete,
  addResult,
  getStatus,
  fetchResults,
  remove,
};
export default job;
