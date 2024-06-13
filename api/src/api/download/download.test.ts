import anyTest, { TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';
import { KeyObject } from 'crypto';

const test = anyTest as TestFn<{ server: Server, port: number, privateKey: KeyObject }>;
import client from '#lib/client';
import getPort from '@ava/get-port';
import crypto from '#crypto';
import { Readable, PassThrough } from 'stream';
import { text } from 'node:stream/consumers';

test.before(async t => {
  const port = await getPort();
  const server = await app(port);
  const api = client(port, "download_user");
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
    name: "test_download"
  }, { chunkSize: 5 });
  if (!upload) {
    t.fail();
    return;
  }
  const { mnemonic } = upload;
  const { data: dataset } = await api.dataset.get(mnemonic);
  if (!dataset) {
    t.fail();
    return;
  }
  const { privateKey } = t.context;
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const keyHash = crypto.publicKey.toHash(publicKey);
  const { keys, chunks } = dataset;
  const encryptedKey = keys.find(k => k.publicKeyHash === keyHash);
  if (!encryptedKey) {
    t.fail();
    return;
  }
  const aesKey = crypto.privateKey.decrypt(privateKey, encryptedKey.key);
  const aesKeyHash = crypto.aesKey.toHash(aesKey);
  t.is(aesKeyHash, dataset.keyHash);

  const pStream = new PassThrough();
  for (const chunk of chunks) {
    const { hash, iv } = chunk;
    const { data: stream } = await api.download.chunk(mnemonic, hash);
    if (!stream) {
      t.fail();
      return;
    }
    const decrypt = crypto.aesKey.decrypt(aesKey, iv);
    const isLast = chunk.end + 1 === dataset.size;
    Readable.fromWeb(stream)
      .pipe(decrypt).pipe(pStream, { end: isLast });
  }
  const result = await text(pStream);
  t.is(result, payload);
});
