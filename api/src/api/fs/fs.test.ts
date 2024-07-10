import app from 'src/app';
import getPort from '@ava/get-port';
import { test, client } from '#ava';

test.before(async t => {
  const port = await getPort();
  const server = await app(port);
  t.context = {
    server,
    port,
    users: {},
    files: {},
    directories: {},
  };
  const api = client(t, "test_fs", true);
  await api.test.addUser("test_fs");
  await api.test.addUser("test_fs_2");

  await api.test.addDirectory("test_dir_A");
  await api.test.addDirectory("test_dir_B");
  await api.test.addFile("File_A", {
    fileName: "test.txt",
    chunkSize: 5,
    data: new Blob(["test data"]),
    directory: t.context.directories.test_dir_A,
  });
  await api.test.addFile("File_B", { directory: t.context.directories.test_dir_A });
  await api.test.addFile("File_C", { directory: t.context.directories.test_dir_A });
})

test.after.always(t => {
  t.context.server.close();
})

test('file', async t => {
  const api = client(t, "test_fs");
  const mnemonic = t.context.files.File_A;
  const { data: info } = await api.fs.file(mnemonic);
  if (!info) {
    t.fail();
    return;
  }
  const { data } = info;
  t.is(data.fileName, "test.txt");
  t.is(data.chunks.length, 2);
  t.is(data.size, 9);
});

test('invalid mnemonic', async t => {
  const api = client(t, "test_fs");
  const { response } = await api.fs.file("invalid_mnemonic");
  t.is(response.status, 404);
})

test('mv file', async t => {
  const api = client(t, "test_fs");
  const directory = t.context.directories.test_dir2;
  const { response } = await api.fs.addMember(directory, {
    subs: ["test_fs_2"],
    keys: [],
  });
  t.is(response.status, 204);

  const { response: response2 } = await api.fs.move({
    mnemonic: t.context.files.File_A,
    parent: t.context.directories.test_dir_B,
  });
  t.is(response2.status, 204);
});


test('file list', async t => {
  const api = client(t, "test_fs");
  const { data: files, response } = await api.fs.listFiles(t.context.files.File_A);
  t.is(response.status, 200);
  if (!files) {
    t.fail();
    return;
  }
  t.is(files.length, 1);
});

test('add directory', async t => {
  const api = client(t, "test_fs");
  const { data: directory, response } = await api.fs.addDirectory("test_dir");
  t.is(response.status, 200);
  if (!directory) {
    t.fail();
    return;
  }
  t.is(directory.name, "test_dir");
  const { data: child, response: response2 } = await api.fs.addDirectory("test_child", directory.mnemonic);
  t.is(response2.status, 200);
  if (!child) {
    t.fail();
    return;
  }
  t.is(child.name, "test_child");
});


