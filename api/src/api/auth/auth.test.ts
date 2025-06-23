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
  const api = client(t, 'test_auth_user', true);
  await api.test.addUser('test_auth_user');
});

test.after.always((t) => {
  t.context.server.close();
});

test('valid access token', async (t) => {
  const api = client(t, 'admin', true);
  const { data } = await api.auth.info();
  t.truthy(data);
  t.truthy(data!.isAdmin);
  const api2 = client(t, 'not_admin');
  const { data: data2 } = await api2.auth.info();
  t.truthy(data2);
  t.falsy(data2!.isAdmin);
});

test('user rsa access token', async (t) => {
  const api = client(t, 'test_auth_user');
  const key = t.context.users.test_auth_user;
  const payload = {
    email: 'test_auth_user@test.com',
  };
  const token = crypto.jwt.signRSA(payload, key);
  const {
    response,
    data: info,
    error,
  } = await api.client.GET('/auth/info', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (error) {
    t.log(error);
    t.fail('Failed to get user info');
  }
  t.is(response.status, 200);
  t.is(info.scopes[0], 'dabih:token');
  t.truthy(info);
});

test('invalid signature', async (t) => {
  const api = client(t, 'test_auth_user');
  const key = await crypto.privateKey.generate();
  const payload = {
    email: 'test_auth_user@test.com',
  };
  const token = crypto.jwt.signRSA(payload, key);
  const { response, error } = await api.client.GET('/auth/info', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  t.is(response.status, 401);
  t.truthy(error);
});

test('invalid email', async (t) => {
  const api = client(t, 'test_auth_user');
  const key = t.context.users.test_auth_user;
  const payload = {
    email: 'invalid_email',
  };
  const token = crypto.jwt.signRSA(payload, key);
  const { response, error } = await api.client.GET('/auth/info', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  t.is(response.status, 401);
  t.truthy(error);
});

test('user with 2 keys', async (t) => {
  const api = client(t, 'test_auth_user', true);

  const { privateKey, publicKey } = await crypto.privateKey.generatePair();
  const jwk = crypto.publicKey.toJwk(publicKey);

  const { response } = await api.user.addKey({
    sub: 'test_auth_user',
    data: jwk,
    isRootKey: false,
  });
  t.is(response.status, 201);

  const payload = {
    email: 'test_auth_user@test.com',
  };
  const token = crypto.jwt.signRSA(payload, privateKey);
  const {
    response: response2,
    data: info,
    error,
  } = await api.client.GET('/auth/info', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (error) {
    t.log(error);
    t.fail('Failed to get user info');
  }
  t.is(response2.status, 200);
  t.truthy(info);
  t.is(info.scopes[0], 'dabih:token');
});

test('get a token', async (t) => {
  const api = client(t, 'test_auth_user');
  const key = t.context.users.test_auth_user;
  const payload = {
    email: 'test_auth_user@test.com',
  };
  const token = crypto.jwt.signRSA(payload, key);

  const { data, error } = await api.client.POST('/auth/token', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  t.log(error);
  t.truthy(data);
});

test('try to get a token with a token', async (t) => {
  const api = client(t, 'test_auth_user');
  const { response, data, error } = await api.auth.token();
  t.log(error);
  t.is(data, undefined);
  t.is(response.status, 401);
});
