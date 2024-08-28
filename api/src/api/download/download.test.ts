import app from 'src/app';
import getPort from '@ava/get-port';
import { test, client } from '#ava';

import crypto from '#crypto';
import { Readable, PassThrough } from 'stream';
import { ReadableStream } from 'node:stream/web';
import { text } from 'node:stream/consumers';

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
  const api = client(t, 'test_downloader', true);
  await api.test.addUser('test_downloader');

  await api.test.addDirectory('download_dir');
  await api.test.addFile('download_file', {
    fileName: 'test.txt',
    chunkSize: 5,
    data: new Blob(['test data longer than 5 bytes']),
    directory: t.context.directories.download_dir,
  });
});

test.after.always((t) => {
  t.context.server.close();
});

test('download', async (t) => {
  const api = client(t, 'test_downloader');
  const mnemonic = t.context.files.download_file;
  const privateKey = t.context.users.test_downloader;
  const { data: file } = await api.fs.file(mnemonic);
  if (!file) {
    t.fail();
    return;
  }
  const aesKey = crypto.fileData.decryptKey(privateKey, file);
  const { chunks, uid } = file.data;
  const pStream = new PassThrough();
  for (const chunk of chunks) {
    const { hash, iv } = chunk;
    const { data: stream } = await api.download.chunk(uid, hash);
    if (!stream) {
      t.fail();
      return;
    }
    const decrypt = crypto.aesKey.decrypt(aesKey, iv);
    const isLast = parseInt(chunk.end) + 1 === parseInt(file.data.size);
    Readable.fromWeb(stream as ReadableStream<Uint8Array>)
      .pipe(decrypt)
      .pipe(pStream, { end: isLast });
  }
  const result = await text(pStream);
  t.is(result, 'test data longer than 5 bytes');
});

test('reject jwt on download endpoint', async (t) => {
  const api = client(t, 'test_downloader');
  const { response } = await api.client.GET('/download');
  t.is(response.status, 401);
});

test('server decrypt', async (t) => {
  const api = client(t, 'test_downloader');
  const mnemonic = t.context.files.download_file;
  const { data: file } = await api.fs.file(mnemonic);
  if (!file) {
    t.fail();
    return;
  }
  const privateKey = t.context.users.test_downloader;
  const aesKey = crypto.fileData.decryptKey(privateKey, file);
  const { response, data: token } = await api.download.decrypt(
    mnemonic,
    aesKey,
  );
  t.is(response.status, 200);
  if (!token) {
    t.fail();
    return;
  }
  const { response: response2, data: stream } = await api.download.get(
    token.value,
  );
  t.is(response2.status, 200);
  if (!stream) {
    t.fail();
    return;
  }
  const result = await text(stream as ReadableStream<Uint8Array>);
  t.is(result, 'test data longer than 5 bytes');
});
