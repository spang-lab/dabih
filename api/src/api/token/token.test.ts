
import anyTest, { TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';

const test = anyTest as TestFn<{ server: Server }>;
import client from '#lib/client';



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
  const response = await client.POST('/token/add', {
    body: {
      scopes: ["upload"],
      lifetime: null
    }
  });
  t.truthy(response.data);
})
