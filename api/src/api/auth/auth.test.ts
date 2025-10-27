import app from 'src/app';
import getPort from '@ava/get-port';
import { test, client } from '#ava';
import crypto from '#crypto';

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
  const api = await client(t, 'test_auth_user', true);
  await api.test.addUser('test_auth_user');
});

test.after.always((t) => {
  t.context.server.close();
});

test('valid access token', async (t) => {
  const api = await client(t, 'admin', true);
  const { data } = await api.auth.info();
  t.truthy(data);
  t.truthy(data!.isAdmin);
  const api2 = await client(t, 'not_admin');
  const { data: data2 } = await api2.auth.info();
  t.truthy(data2);
  t.falsy(data2!.isAdmin);
});

test('refresh access token', async (t) => {
  const api = await client(t, 'test_auth_user');
  const key = t.context.users.test_auth_user;
  const payload = {
    sub: 'test_auth_user',
  };
  const token = crypto.jwt.signWithRSA(payload, key);

  const { response, data: jwt, error } = await api.auth.refresh(token);
  if (error) {
    t.log(error);
    t.fail('Failed to get token');
  }
  t.is(response.status, 200);
  t.truthy(jwt);
});

test('invalid refresh signature', async (t) => {
  const api = await client(t, 'test_auth_user');
  const key = await crypto.privateKey.generate();
  const payload = {
    sub: 'test_auth_user',
  };
  const token = crypto.jwt.signWithRSA(payload, key);
  const { response, error } = await api.auth.refresh(token);
  t.is(response.status, 401);
  t.truthy(error);
});

test('invalid sub', async (t) => {
  const api = await client(t, 'test_auth_user');
  const key = t.context.users.test_auth_user;
  const payload = {
    sub: 'invalid_user',
  };
  const token = crypto.jwt.signWithRSA(payload, key);
  const { response, error } = await api.auth.refresh(token);
  t.is(response.status, 404);
  t.truthy(error);
});

test('user with 2 keys', async (t) => {
  const api = await client(t, 'test_auth_user', true);

  const { privateKey, publicKey } = await crypto.privateKey.generatePair();
  const jwk = crypto.publicKey.toJwk(publicKey);

  const { response } = await api.user.addKey({
    sub: 'test_auth_user',
    data: jwk,
    isRootKey: false,
  });
  t.is(response.status, 201);

  const payload = {
    sub: 'test_auth_user',
  };
  const token = crypto.jwt.signWithRSA(payload, privateKey);
  const {
    response: response2,
    data: info,
    error,
  } = await api.auth.refresh(token);
  if (error) {
    t.log(error);
    t.fail('Failed to get user info');
  }
  t.is(response2.status, 200);
  t.truthy(info);
});

test('sign in with email', async (t) => {
  const api = await client(t, 'test_auth_user');
  const { data: token, error } = await api.auth.signIn(
    'unknown-email@dabih.com',
  );
  t.falsy(error);
  t.truthy(token);
});
