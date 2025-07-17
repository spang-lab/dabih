import app from '../../../src/app';
import getPort from '@ava/get-port';
import { test } from '#ava';
import job from './job';
test.before(async (t) => {
    const port = await getPort();
    const server = await app(port);
    t.context = {
        server,
        port,
        users: {},
        files: {},
        directories: {},
    };
});
test.after.always((t) => {
    t.context.server.close();
});
test('create,run,complete', async (t) => {
    const sub = 'sub';
    const jobId = await job.create(sub);
    for (let i = 0; i < 110; i++) {
        await job.addResult(jobId, i.toString());
    }
    await job.complete(jobId);
    const results = await job.fetchResults(jobId, sub);
    t.is(results.status, 'complete');
    t.is(results.data.length, 100);
    t.is(results.data[0], '0');
    t.is(results.data[99], '99');
    const results2 = await job.fetchResults(jobId, sub);
    t.is(results2.status, 'complete');
    t.is(results2.data.length, 10);
    t.deepEqual(results2.data, [
        '100',
        '101',
        '102',
        '103',
        '104',
        '105',
        '106',
        '107',
        '108',
        '109',
    ]);
});
test('addResults', async (t) => {
    const sub = 'sub';
    const jobId = await job.create(sub);
    const results = Array.from({ length: 10 }, (_, i) => i.toString());
    await job.addResults(jobId, results);
    await job.complete(jobId);
    const fetched = await job.fetchResults(jobId, sub);
    t.deepEqual(fetched.data, results);
});
//# sourceMappingURL=job.test.js.map