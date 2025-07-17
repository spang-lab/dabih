import job from '#lib/redis/job';
export default async function searchResults(user, jobId) {
    const { sub } = user;
    const { data, status } = await job.fetchResults(jobId, sub);
    const inodes = data.map((json) => JSON.parse(json));
    if (status === 'failed') {
        throw new Error('Search failed');
    }
    const isComplete = status === 'complete' && inodes.length === 0;
    if (isComplete) {
        await job.remove(jobId);
    }
    return {
        inodes,
        isComplete,
    };
}
//# sourceMappingURL=searchResults.js.map