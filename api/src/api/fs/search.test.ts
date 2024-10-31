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
  const api = client(t, 'test_search', true);
  await api.test.addUser('test_search');

  await api.test.addDirectory('test_search');
  const mnemonic = t.context.directories.test_search;
  await api.test.addFile('file1', { directory: mnemonic });
  await api.test.addFile('file2', { directory: mnemonic });
});

test.after.always((t) => {
  t.context.server.close();
});

test('basic search', async (t) => {
  const api = client(t, 'test_search');
  const { data } = await api.fs.search({ query: 'file' });
  t.log(data);
  t.pass();
});
