import anyTest, { TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';

const test = anyTest as TestFn<{ server: Server, port: number, privateKey: KeyObject }>;
import client from '#lib/client';
import getPort from '@ava/get-port';
import crypto from '#crypto';
import { KeyObject, createHash } from 'crypto';

test.before(async t => {
  const port = await getPort();
  const server = await app(port);
  const api = client(port, "test_user");
  const privateKey = await crypto.privateKey.generate();
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const jwk = crypto.publicKey.toJwk(publicKey);
  await api.user.add({
    name: "test_user",
    email: "test_user@test.com",
    key: jwk,
  });

  const data = new Blob(["test data"]);
  await api.upload.blob({ fileName: "test.txt", data, tag: "test_tag" });
  await api.upload.blob({ fileName: "test2.txt", data, tag: "test_tag" });
  await api.upload.blob({ fileName: "test3.txt", data, tag: "test_tag" });
  await api.upload.blob({ fileName: "test_aXd7de.txt", data, tag: "test_tag" });
  const { data: dataset } = await api.upload.blob({ fileName: "test_deleted.txt", data, tag: "test_tag" });
  await api.dataset.remove(dataset!.mnemonic);

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
  const api = client(t.context.port, "test_user");
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
  t.log(info);
  const { data } = info;
  t.is(data.fileName, "test.txt");
  t.is(data.chunks.length, 2);
  t.is(data.size, 9);
  t.is(info.members.length, 1);
  t.is(info.members[0].sub, "test_user");
});

test('invalid mnemonic', async t => {
  const api = client(t.context.port, "test_user");
  const { response } = await api.fs.file("invalid_mnemonic");
  t.is(response.status, 404);
})
