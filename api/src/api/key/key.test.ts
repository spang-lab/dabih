import anyTest, { ExecutionContext, TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';

const test = anyTest as TestFn<{ server: Server, port: number }>;
import client from '#lib/client';
import crypto from '#crypto';
import getPort from '@ava/get-port';

test.before(async t => {
  const port = await getPort();
  t.context = {
    server: await app(port),
    port,
  };
})

test.after.always(t => {
  t.context.server.close();
})



test('add key', async t => {
  const api = client(t.context.port);
  const { publicKey } = await crypto.privateKey.generatePair();
  const jwk = crypto.publicKey.toJwk(publicKey);

  const { response, data: key } = await api.key.add({
    data: jwk,
    isRootKey: false,
    user: {
      name: "test",
      email: "test@test.com"
    }
  });

  t.is(response.status, 200);
  if (!key) {
    t.fail('No data');
    return;
  }
  const { response: response2 } = await api.key.remove(key.id);
  t.is(response2.status, 204);
});

test('add invalid key', async t => {
  const api = client(t.context.port);
  const { response } = await api.key.add({
    data: {},
    isRootKey: false,
    user: {
      name: "test",
      email: "test@test.com"
    }
  });
  t.is(response.status, 500);

});
