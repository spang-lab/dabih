import anyTest, { TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';

const test = anyTest as TestFn<{ server: Server, port: number, privateKey: KeyObject }>;
import client from '#lib/client';
import getPort from '@ava/get-port';
import crypto from '#crypto';
import { KeyObject } from 'crypto';

test.before(async t => {
  const port = await getPort();
  const server = await app(port);
  const api = client(port, "test_fs", true);
  const privateKey = await crypto.privateKey.generate();
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const jwk = crypto.publicKey.toJwk(publicKey);
  await api.user.add({
    name: "test_fs",
    email: "test_fs@test.com",
    key: jwk,
  });

  const data = new Blob(["test data"]);
  await api.upload.blob({ fileName: "test.txt", data, tag: "test_tag" });
  await api.upload.blob({ fileName: "test2.txt", data, tag: "test_tag" });
  await api.upload.blob({ fileName: "test3.txt", data, tag: "test_tag" });
  await api.upload.blob({ fileName: "test_aXd7de.txt", data, tag: "test_tag" });
  const { data: dataset } = await api.upload.blob({ fileName: "test_deleted.txt", data, tag: "test_tag" });
  await api.fs.removeFile(dataset!.mnemonic);

  t.context = {
    server,
    privateKey,
    port,
  };
})

test.after.always(t => {
  t.context.server.close();
})

test('file', async t => {
  const api = client(t.context.port, "test_fs");
  const { data: file } = await api.upload.blob({
    fileName: "test.txt",
    data: new Blob(["test data"]),
    tag: "file_test",
  }, { chunkSize: 5 });
  if (!file) {
    t.fail();
    return;
  }
  const { mnemonic } = file;
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
  const api = client(t.context.port, "test_fs");
  const { response } = await api.fs.file("invalid_mnemonic");
  t.is(response.status, 404);
})


test('file list', async t => {
  const api = client(t.context.port, "test_fs");
  const { data: file } = await api.upload.blob({
    fileName: "test.txt",
    data: new Blob(["test data"]),
    tag: "file_test",
  }, { chunkSize: 5 });
  if (!file) {
    t.fail();
    return;
  }
  const { mnemonic } = file;
  const { data: files, response } = await api.fs.listFiles(mnemonic);
  t.is(response.status, 200);
  if (!files) {
    t.fail();
    return;
  }
  t.is(files.length, 1);
});

test('add directory', async t => {
  const api = client(t.context.port, "test_fs");
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


