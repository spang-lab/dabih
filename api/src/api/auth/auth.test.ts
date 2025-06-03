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
