import app from '../../../src/app';
import getPort from '@ava/get-port';
import { test } from '#ava';
import { clearSecrets, generateSecret, getSecret, getSecrets } from './secrets';
import crypto from '../crypto';
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
test('generate secret', async (t) => {
    const now = Math.floor(Date.now() / 1000);
    const secret = await generateSecret('gen', 0);
    t.truthy(secret, 'Should generate a secret');
    t.is(secret.expiresAt, now);
});
test('get a secret', async (t) => {
    await clearSecrets('test');
    const secret = await getSecret('test');
    const secret2 = await getSecret('test');
    t.is(secret, secret2, 'Should return the same secret on subsequent calls');
});
test('secret expires', async (t) => {
    await clearSecrets('expire');
    const secret = await getSecret('expire', 0);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const secret2 = await getSecret('expire', 0);
    t.not(secret, secret2, 'Should return a different secret after expiration');
    const secrets = await getSecrets('expire');
    t.is(secrets.length, 2, 'Should have two secrets in the list');
});
test('sign and verify', async (t) => {
    await clearSecrets('sign');
    const secret = await getSecret('sign');
    const data = { test: 'data' };
    const jwt = crypto.jwt.signWithSecret(data, secret);
    t.truthy(jwt, 'Should sign data with secret');
    const secrets = await getSecrets('sign');
    const verified = crypto.jwt.verifyWithSecrets(jwt, secrets);
    t.truthy(verified, 'Should verify signed data with secrets');
    if (typeof verified === 'string' || !verified.test) {
        t.fail('Verified data should be an object');
        return;
    }
    t.is(verified.test, data.test, 'Should match original data');
});
//# sourceMappingURL=secrets.test.js.map