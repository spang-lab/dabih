import job from '#lib/redis/job';
import { searchWorker } from '../../worker/index';
export default async function searchStart(user, body) {
    const { sub } = user;
    const jobId = await job.create(sub);
    void searchWorker.run({ user, body, jobId }, { name: 'search' });
    return { jobId };
}
//# sourceMappingURL=searchStart.js.map