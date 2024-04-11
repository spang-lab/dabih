
import anyTest, { ExecutionContext, TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';

const test = anyTest as TestFn<{ server: Server }>;
import client from '#lib/client';


const cleanup = async (t: ExecutionContext, id?: number) => {
  if (!id) {
    return;
  }
  const { response } = await client.POST('/token/{tokenId}/remove', {
    params: {
      path: { tokenId: id },
    }
  });
  t.is(response.status, 204);
}


test.before(async t => {
  t.context = {
    server: await app()
  };
})

test.after.always(t => {
  t.context.server.close();
})

test('valid access token', async t => {
  const response = await client.GET('/token/info')
  t.truthy(response.data);
  t.truthy(response.data!.isAdmin);
})

test('create a dabih access_token', async t => {
  const { data } = await client.POST('/token/add', {
    body: {
      scopes: ["upload"],
      lifetime: null
    }
  });
  t.truthy(data);
  await cleanup(t, data?.id);
})

test('invalid scope', async t => {
  const { response } = await client.POST('/token/add', {
    body: {
      scopes: ["uploads"],
      lifetime: null
    }
  });
  t.is(response.status, 500);
});
test('use access token', async t => {
  const scopes = ["token"];
  const { data } = await client.POST('/token/add', {
    body: {
      scopes,
      lifetime: null,
    }
  });
  if (!data) {
    return t.fail()
  }
  const { value } = data;
  const result = await client.GET('/token/info', {
    headers: {
      Authorization: `Bearer ${value}`
    },
  });
  t.truthy(result.data);
  t.deepEqual(result.data?.scopes, scopes)

  const { data: data2 } = await client.POST('/token/add', {
    headers: {
      Authorization: `Bearer ${value}`
    },
    body: {
      scopes,
      lifetime: null,
    },
  });
  t.truthy(data2);

  await cleanup(t, data.id);
  await cleanup(t, data2?.id);
});


test('expire token', async t => {
  const scopes = ["upload", "token"];
  const { data } = await client.POST('/token/add', {
    body: {
      scopes,
      lifetime: -1,
    }
  });
  if (!data) {
    return t.fail()
  }
  const { value } = data;
  const result = await client.GET('/token/info', {
    headers: {
      Authorization: `Bearer ${value}`
    },
  });
  t.is(result.response.status, 401)
  t.falsy(result.data);
  await cleanup(t, data.id);
});

test('list tokens', async t => {
  const { data } = await client.POST('/token/add', {
    body: {
      scopes: [],
      lifetime: null,
    }
  });
  if (!data) {
    return t.fail()
  }
  const result = await client.GET('/token/list')
  if (!result.data) {
    return t.fail();
  }
  const tokens = result.data;
  t.truthy(tokens.length > 1)
  await cleanup(t, data.id);
})

