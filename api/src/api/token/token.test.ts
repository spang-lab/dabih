import app from 'src/app';
import getPort from '@ava/get-port';
import { test, client } from '#ava';

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

test('create a dabih access_token', async (t) => {
  const api = await client(t, 'test_token');
  const { data, error } = await api.token.add({
    scopes: ['dabih:base'],
    lifetime: null,
  });
  if (!data || error) {
    t.log(error);
    t.fail();
    return;
  }
  const { response } = await api.token.remove(data.id);
  t.is(response.status, 204);
});

test('invalid scope', async (t) => {
  const api = await client(t, 'test_token');
  const { response } = await api.token.add({
    scopes: ['upload'],
    lifetime: null,
  });
  t.is(response.status, 500);
});

test('use access token', async (t) => {
  const api = await client(t, 'test_token');
  const scopes = ['dabih:api'];
  const { data: token } = await api.token.add({
    scopes,
    lifetime: null,
  });
  if (!token) {
    return t.fail();
  }
  const { value } = token;
  const { data: info } = await api.client.GET('/auth/info', {
    headers: {
      Authorization: `Bearer ${value}`,
    },
  });
  t.truthy(info);
  t.deepEqual(info?.scopes, scopes);

  const { data: token2 } = await api.client.POST('/token/add', {
    headers: {
      Authorization: `Bearer ${value}`,
    },
    body: {
      scopes,
      lifetime: null,
    },
  });
  t.truthy(token2);
  await api.token.remove(token.id);
  if (!token2) {
    return t.fail();
  }
  await api.token.remove(token2?.id);
});

test('expire token', async (t) => {
  const api = await client(t, 'test_token');
  const scopes = ['dabih:api'];
  const { data: token } = await api.token.add({
    scopes,
    lifetime: 0,
  });
  if (!token) {
    return t.fail();
  }
  const { value } = token;
  const {
    response,
    data: info,
    error,
  } = await api.client.GET('/auth/info', {
    headers: {
      Authorization: `Bearer ${value}`,
    },
  });
  t.truthy(error);
  t.is(response.status, 401);
  t.falsy(info);
  await api.token.remove(token.id);
});

test('list tokens', async (t) => {
  const api = await client(t, 'test_token');
  const { data: token } = await api.token.add({
    scopes: [],
    lifetime: null,
  });
  if (!token) {
    return t.fail();
  }
  const { data: tokenList } = await api.token.list();
  if (!tokenList) {
    return t.fail();
  }
  t.truthy(tokenList.length >= 1);
  await api.token.remove(token.id);
});
