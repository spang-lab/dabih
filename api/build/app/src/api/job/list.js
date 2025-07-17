import job from '#lib/redis/job';
export default async function listJobs() {
    const jobs = await job.list();
    return jobs;
}
//# sourceMappingURL=list.js.map