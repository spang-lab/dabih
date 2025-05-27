import app from 'src/app';
import getPort from '@ava/get-port';
import { test } from '#ava';
import { rateLimit } from './rateLimit';

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

test('rate limit within limit', async (t) => {
  const ip = '1.2.3.4';
  for (let i = 0; i < 3; i++) {
    await rateLimit(ip);
  }
  t.pass('Rate limit did not exceed');
});

test('rate limit exceeded', async (t) => {
  const ip = '5.6.7.8';
  for (let i = 0; i < 3; i++) {
    await rateLimit(ip);
  }
  try {
    await rateLimit(ip);
    t.fail('Expected rate limit to be exceeded');
  } catch (error: unknown) {
    t.true(error instanceof Error);
    t.is(
      (error as Error).message,
      'Rate limit exceeded. Please try again later.',
    );
  }
});
