import anyTest, { TestFn } from 'ava';
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

test('add user', async t => {
  const api = client(t.context.port);
  const { publicKey } = await crypto.privateKey.generatePair();
  const jwk = crypto.publicKey.toJwk(publicKey);

  const { response, data: user } = await api.user.add({
    sub: "test",
    name: "test",
    email: "test",
    key: jwk,
  });

  t.is(response.status, 201);
  if (!user) {
    t.fail('No data');
    return;
  }
  const { response: response2 } = await api.user.remove(user.sub);
  t.is(response2.status, 204);
});

test('add invalid key', async t => {
  const api = client(t.context.port);
  const { error, response } = await api.user.add({
    sub: "testuser",
    name: "test",
    email: "test",
    key: {
      kty: "RSA",
      e: "AQAB",
      n: "invalid",
    },
  });
  t.truthy(error);
  t.is(response.status, 500);
});

test('add user with two keys', async t => {
  const api = client(t.context.port);
  const { publicKey } = await crypto.privateKey.generatePair();
  const jwk = crypto.publicKey.toJwk(publicKey);

  const sub = "testuser_2keys";

  const { response, data: user } = await api.user.add({
    sub,
    name: "test",
    email: "test",
    key: jwk,
  });
  t.is(response.status, 201);
  if (!user) {
    t.fail('No data');
    return;
  }
  const { publicKey: publicKey2 } = await crypto.privateKey.generatePair();
  const jwk2 = crypto.publicKey.toJwk(publicKey2);
  const { response: response2 } = await api.user.addKey({
    sub,
    data: jwk2,
    isRootKey: false,
  });
  t.is(response2.status, 201);
  const { data: info } = await api.user.find(sub);

  t.is(info?.keys.length, 2);
  const { response: response3 } = await api.user.remove(sub);
  t.is(response3.status, 204);
});

test('add the same key twice', async t => {
  const api = client(t.context.port);
  const { publicKey } = await crypto.privateKey.generatePair();
  const jwk = crypto.publicKey.toJwk(publicKey);

  const sub = "testuser_key_collide";
  const { response, data: user } = await api.user.add({
    sub,
    name: "test",
    email: "test",
    key: jwk,
  });
  t.is(response.status, 201);
  if (!user) {
    t.fail('No data');
    return;
  }
  const { response: response2 } = await api.user.addKey({
    sub,
    data: jwk,
    isRootKey: false,
  });
  t.is(response2.status, 500);
  const { response: response3 } = await api.user.remove(sub);
  t.is(response3.status, 204);
});

test('remove key', async t => {
  const api = client(t.context.port);
  const { publicKey } = await crypto.privateKey.generatePair();
  const jwk = crypto.publicKey.toJwk(publicKey);

  const sub = "testuser_key_remove";
  const { response, data: user } = await api.user.add({
    sub,
    name: "test",
    email: "test",
    key: jwk,
  });
  t.is(response.status, 201);
  if (!user) {
    t.fail('No data');
    return;
  }
  const { hash } = user.keys[0];
  const { response: response2 } = await api.user.removeKey({
    sub,
    hash,
  });
  t.is(response2.status, 204);
  const { response: response3 } = await api.user.remove(sub);
  t.is(response3.status, 204);
});


test('disable/enable key', async t => {
  const api = client(t.context.port);
  const { publicKey } = await crypto.privateKey.generatePair();
  const jwk = crypto.publicKey.toJwk(publicKey);

  const sub = "testuser_key_disable";
  const { response, data: user } = await api.user.add({
    sub,
    name: "test",
    email: "test",
    key: jwk,
  });
  t.is(response.status, 201);
  if (!user) {
    t.fail('No data');
    return;
  }
  const userKey = user.keys[0];
  const { hash } = userKey;
  const { response: response2, data: key } = await api.user.enableKey({
    sub,
    hash,
    enabled: false,
  });
  t.is(response2.status, 200);
  t.is(key?.enabled, null);
  t.is(key?.enabledBy, null);

  const { response: response3, data: key2 } = await api.user.enableKey({
    sub,
    hash,
    enabled: true,
  });
  t.is(response3.status, 200);
  t.truthy(key2?.enabled);
  t.is(key2?.enabledBy, userKey.enabledBy);

  const { response: response4 } = await api.user.remove(sub);
  t.is(response4.status, 204);
});