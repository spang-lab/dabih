
import anyTest, { TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';

const test = anyTest as TestFn<{ server: Server, port: number }>;
import client from '#lib/client';
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

test('valid access token', async t => {
  const api = client(t.context.port);
  const { data } = await api.token.info();
  t.truthy(data);
  t.truthy(data!.isAdmin);
})

test('create a dabih access_token', async t => {
  const api = client(t.context.port);
  const { data } = await api.token.add({
    scopes: ["dabih:upload"],
    lifetime: null,
  });
  t.truthy(data);
  if (data) {
    const { response } = await api.token.remove(data.id);
    t.is(response.status, 204);
  }
})

test('invalid scope', async t => {
  const api = client(t.context.port);
  const { response } = await api.token.add({
    scopes: ["upload"],
    lifetime: null,
  });
  t.is(response.status, 500);
});

test('use access token', async t => {
  const api = client(t.context.port);
  const scopes = ["dabih:api"];
  const { data: token } = await api.token.add({
    scopes,
    lifetime: null,
  });
  if (!token) {
    return t.fail()
  }
  const { value } = token;
  const { data: info } = await api.GET('/token/info', {
    headers: {
      Authorization: `Bearer ${value}`
    },
  });
  t.truthy(info);
  t.deepEqual(info?.scopes, scopes)

  const { data: token2 } = await api.POST('/token/add', {
    headers: {
      Authorization: `Bearer ${value}`
    },
    body: {
      scopes,
      lifetime: null,
    },
  });
  t.truthy(token2);
  await api.token.remove(token.id);
  if (!token2) {
    return t.fail()
  }
  await api.token.remove(token2?.id);
});


test('expire token', async t => {
  const api = client(t.context.port);
  const scopes = ["dabih:api"];
  const { data: token } = await api.token.add({
    scopes,
    lifetime: 0,
  });
  if (!token) {
    return t.fail()
  }
  const { value } = token;
  const { response, data: info } = await api.GET('/token/info', {
    headers: {
      Authorization: `Bearer ${value}`
    },
  });
  t.is(response.status, 401)
  t.falsy(info);
  await api.token.remove(token.id);
});

test('list tokens', async t => {
  const api = client(t.context.port);
  const { data: token } = await api.token.add({
    scopes: [],
    lifetime: null,
  });
  if (!token) {
    return t.fail()
  }
  const { data: tokenList } = await api.token.list();
  if (!tokenList) {
    return t.fail();
  }
  t.truthy(tokenList.length >= 1)
  await api.token.remove(token.id);
})

