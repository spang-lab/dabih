import app from 'src/app';
import getPort from '@ava/get-port';
import { test, client } from '#ava';

import { parseDigest, parseContentRange } from './util';
import { validChunkEnd } from './finish';
import crypto from '#lib/crypto/index';

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
  const api = client(t, 'test_uploader', true);
  await api.test.addUser('test_uploader');
});

test.after.always((t) => {
  t.context.server.close();
});

test('upload start', async (t) => {
  const api = client(t, 'test_uploader');
  const { response, data: dataset } = await api.upload.start({
    fileName: 'test.txt',
    tag: 'unfinished',
  });
  t.is(response.status, 201);
  if (!dataset) {
    t.fail('No dataset');
    return;
  }
  const { response: response2, data: unfinished } =
    await api.upload.unfinished();
  const match = unfinished?.find((d) => d.mnemonic === dataset.mnemonic);
  t.truthy(match);
  t.is(response2.status, 200);

  const { response: response3 } = await api.upload.cancel(dataset.mnemonic);
  t.is(response3.status, 204);
});

test('upload chunk', async (t) => {
  const api = client(t, 'test_uploader');
  const { response: response, data: dataset } = await api.upload.start({
    fileName: 'test.txt',
  });
  t.is(response.status, 201);
  if (!dataset) {
    t.fail('No dataset');
    return;
  }
  const { mnemonic } = dataset;

  const { response: response2 } = await api.upload.chunk({
    mnemonic,
    start: 0,
    end: 3,
    size: 4,
    hash: 'n4bQgYhMfWWaL-qgxVrQFaO_TxsrC4Is0V1sFbDwCgg',
    data: new Blob(['test']),
  });
  t.is(response2.status, 201);
  const { response: response3 } = await api.upload.cancel(mnemonic);
  t.is(response3.status, 204);
});

test('full upload', async (t) => {
  const api = client(t, 'test_uploader');
  const { response: response, data: dataset } = await api.upload.start({
    fileName: 'test_ok.txt',
    size: 4,
  });
  t.is(response.status, 201);
  if (!dataset) {
    t.fail('No dataset');
    return;
  }
  const { mnemonic } = dataset;

  const { response: response2 } = await api.upload.chunk({
    mnemonic,
    start: 0,
    end: 3,
    size: 4,
    hash: 'n4bQgYhMfWWaL-qgxVrQFaO_TxsrC4Is0V1sFbDwCgg',
    data: new Blob(['test']),
  });
  t.is(response2.status, 201);
  const { response: response3, data: fullDataset } =
    await api.upload.finish(mnemonic);
  t.is(response3.status, 200);
  t.is(fullDataset?.data.hash, 'lU1aSf1w2bi82zXSUiZ4KZV_fvf6bHT4hBm9xegiCfQ');
});

test('upload blob', async (t) => {
  const api = client(t, 'test_uploader');
  const dataset = await api.test.addFile('file');
  t.truthy(dataset);
});

test('upload blob into directory', async (t) => {
  const api = client(t, 'test_uploader');
  const { data: directory } = await api.fs.addDirectory('test_dir');
  if (!directory) {
    t.fail('No directory');
    return;
  }
  const dataset = await api.test.addFile('dir_file', {
    directory: directory.mnemonic,
  });
  t.truthy(dataset);
});

test('upload blob, multiple chunks', async (t) => {
  const api = client(t, 'test_uploader');
  const dataset = await api.test.addFile('multi_chunk', { chunkSize: 4 });
  if (!dataset) {
    t.fail('No dataset');
    return;
  }
  const { mnemonic } = dataset;
  const { response, data: info } = await api.fs.file(mnemonic);
  t.is(response.status, 200);
  t.is(info?.data.chunks.length, 3);
});

test('digest parsing', (t) => {
  t.is(parseDigest('SHA-256=abc'), 'abc');
  t.is(parseDigest('sha-256=abc'), 'abc');
  t.is(
    parseDigest('SHA-256=n4bQgYhMfWWaL-qgxVrQFaO_TxsrC4Is0V1sFbDwCgg'),
    'n4bQgYhMfWWaL-qgxVrQFaO_TxsrC4Is0V1sFbDwCgg',
  );
  t.is(parseDigest('SHA-256=test='), 'test');
  t.is(parseDigest('SHA-256=test=='), 'test');
  t.throws(() => parseDigest('SHA-256='));
  t.throws(() => parseDigest('xSHA-256=abc'));
});

test('content range parsing', (t) => {
  t.deepEqual(parseContentRange('bytes 0-3/4'), { start: 0, end: 3, size: 4 });
  t.deepEqual(parseContentRange('bytes 0-3/*'), { start: 0, end: 3 });
  t.deepEqual(parseContentRange('bytes 0-3/16'), {
    start: 0,
    end: 3,
    size: 16,
  });
  t.throws(() => parseContentRange('bytes 0-3'));
  t.throws(() => parseContentRange('bytes 0-3/'));
  t.throws(() => parseContentRange('bytes 0-3/4/5'));
  t.throws(() => parseContentRange('bytes 3-2/1'));
});

test('chunk validation', (t) => {
  t.is(validChunkEnd([]), -1);
  t.is(validChunkEnd([{ start: 0, end: 3 }]), 3);
  t.is(
    validChunkEnd([
      { start: 0, end: 2 },
      { start: 4, end: 5 },
    ]),
    -1,
  );
  t.is(
    validChunkEnd([
      { start: 0, end: 3 },
      { start: 4, end: 5 },
    ]),
    5,
  );
});
