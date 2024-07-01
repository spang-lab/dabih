import anyTest, { TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';
import { KeyObject } from 'crypto';

const test = anyTest as TestFn<{ server: Server, port: number, privateKey: KeyObject }>;
import client from '#lib/client';
import getPort from '@ava/get-port';
import crypto from '#crypto';
import { Readable, PassThrough } from 'stream';
import { ReadableStream } from 'node:stream/web';
import { text } from 'node:stream/consumers';

test.before(async t => {
  const port = await getPort();
  const server = await app(port);
  const api = client(port, "download_user", true);
  const privateKey = await crypto.privateKey.generate();
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const jwk = crypto.publicKey.toJwk(publicKey);
  await api.user.add({
    name: "test_user",
    email: "test_user@test.com",
    key: jwk,
  });

  t.context = {
    server,
    privateKey,
    port,
  };
})

test.after.always(t => {
  t.context.server.close();
})

test('download', async t => {
  const api = client(t.context.port, "download_user");
  const payload = "Test data longer than 5 bytes"
  const { data: upload } = await api.upload.blob({
    fileName: "test.txt",
    data: new Blob([payload]),
    tag: "test_download"
  }, { chunkSize: 5 });
  if (!upload) {
    t.fail();
    return;
  }
  const { mnemonic } = upload;
  const { data: dataset } = await api.fs.file(mnemonic);
  if (!dataset) {
    t.fail();
    return;
  }
  const { privateKey } = t.context;
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const keyHash = crypto.publicKey.toHash(publicKey);
  const { keys, chunks, uid } = dataset.data;
  const encryptedKey = keys.find(k => k.hash === keyHash);
  if (!encryptedKey) {
    t.fail();
    return;
  }
  const aesKey = crypto.privateKey.decrypt(privateKey, encryptedKey.key);
  const aesKeyHash = crypto.aesKey.toHash(aesKey);
  t.is(aesKeyHash, dataset.data.keyHash);

  const pStream = new PassThrough();
  for (const chunk of chunks) {
    const { hash, iv } = chunk;
    const { data: stream } = await api.download.chunk(uid, hash);
    if (!stream) {
      t.fail();
      return;
    }
    const decrypt = crypto.aesKey.decrypt(aesKey, iv);
    const isLast = chunk.end + 1 === dataset.data.size;
    Readable.fromWeb(stream as ReadableStream<Uint8Array>)
      .pipe(decrypt).pipe(pStream, { end: isLast });
  }
  const result = await text(pStream);
  t.is(result, payload);
});


test('reject jwt on download endpoint', async t => {
  const api = client(t.context.port, "download_user");
  const { response } = await api.client.GET("/download");
  t.is(response.status, 401);
});



test('server decrypt', async t => {
  const api = client(t.context.port, "download_user");
  const payload = "Test data for server decrypt";
  const { data: upload } = await api.upload.blob({
    fileName: "test.txt",
    data: new Blob([payload]),
    tag: "test_download"
  }, { chunkSize: 5 });
  if (!upload) {
    t.fail();
    return;
  }
  const { mnemonic } = upload;
  const { data: dataset } = await api.fs.file(mnemonic);
  if (!dataset) {
    t.fail();
    return;
  }
  const { privateKey } = t.context;
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const keyHash = crypto.publicKey.toHash(publicKey);
  const { keys } = dataset.data;
  const encryptedKey = keys.find(k => k.hash === keyHash);
  if (!encryptedKey) {
    t.fail();
    return;
  }
  const aesKey = crypto.privateKey.decrypt(privateKey, encryptedKey.key);
  const { response, data: token } = await api.download.decrypt(mnemonic, aesKey);
  t.is(response.status, 200);
  if (!token) {
    t.fail();
    return;
  }
  const { response: response2, data: stream } = await api.download.get(token.value);
  t.is(response2.status, 200);
  if (!stream) {
    t.fail();
    return;
  }
  const result = await text(stream as ReadableStream<Uint8Array>);
  t.is(result, payload);
});
