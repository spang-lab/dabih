import anyTest, { TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';

const test = anyTest as TestFn<{ server: Server, port: number, privateKey: KeyObject }>;
import client from '#lib/client';
import getPort from '@ava/get-port';
import crypto from '#crypto';
import { parseDigest, parseContentRange } from './util';
import { KeyObject } from 'crypto';
import { validChunkEnd } from './finish';

test.before(async t => {
  const port = await getPort();
  const server = await app(port);
  const api = client(port);
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

test.after.always(async t => {
  const api = client(t.context.port);
  const { data: user } = await api.user.me();
  if (!user) {
    t.fail('No user');
    return;
  }
  await api.user.remove(user.sub);
  t.context.server.close();
})

test('upload start', async t => {
  const api = client(t.context.port);
  const { response, data: dataset } = await api.upload.start({
    fileName: "test.txt",
  });
  t.is(response.status, 201);
  if (!dataset) {
    t.fail('No dataset');
    return;
  }
  const { response: response2 } = await api.upload.cancel(dataset.mnemonic);
  t.is(response2.status, 204);
});


test('upload chunk', async t => {
  const api = client(t.context.port);
  const { response: response, data: dataset } = await api.upload.start({
    fileName: "test.txt",
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


test('full upload', async t => {
  const api = client(t.context.port);
  const { response: response, data: dataset } = await api.upload.start({
    fileName: "test_ok.txt",
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
  const { response: response3, data: fullDataset } = await api.upload.finish(mnemonic);
  t.is(response3.status, 200);
  t.is(fullDataset?.data.hash, 'lU1aSf1w2bi82zXSUiZ4KZV_fvf6bHT4hBm9xegiCfQ');
});


test('upload blob', async t => {
  const api = client(t.context.port);
  const data = new Blob(['test']);
  const { data: dataset, error } = await api.upload.blob({ fileName: 'test.txt', data });
  t.truthy(dataset);
  t.falsy(error);
});

test('upload blob, multiple chunks', async t => {
  const api = client(t.context.port);
  const data = new Blob(['test data']);
  const { data: dataset } = await api.upload.blob({ fileName: 'test.txt', data },
    { chunkSize: 4 });
  if (!dataset) {
    t.fail('No dataset');
    return;
  }
  const { mnemonic } = dataset;
  const { response, data: info } = await api.fs.file(mnemonic);
  t.is(response.status, 200);
  t.is(info?.data.chunks.length, 3);
});


test('digest parsing', t => {
  t.is(parseDigest('SHA-256=abc'), 'abc');
  t.is(parseDigest('sha-256=abc'), 'abc');
  t.is(
    parseDigest('SHA-256=n4bQgYhMfWWaL-qgxVrQFaO_TxsrC4Is0V1sFbDwCgg'),
    'n4bQgYhMfWWaL-qgxVrQFaO_TxsrC4Is0V1sFbDwCgg');
  t.is(parseDigest('SHA-256=test='), 'test');
  t.is(parseDigest('SHA-256=test=='), 'test');
  t.throws(() => parseDigest('SHA-256='));
  t.throws(() => parseDigest('xSHA-256=abc'));
});

test('content range parsing', t => {
  t.deepEqual(parseContentRange('bytes 0-3/4'), { start: 0, end: 3, size: 4 });
  t.deepEqual(parseContentRange('bytes 0-3/*'), { start: 0, end: 3 });
  t.deepEqual(parseContentRange('bytes 0-3/16'), { start: 0, end: 3, size: 16 });
  t.throws(() => parseContentRange('bytes 0-3'));
  t.throws(() => parseContentRange('bytes 0-3/'));
  t.throws(() => parseContentRange('bytes 0-3/4/5'));
  t.throws(() => parseContentRange('bytes 3-2/1'));
});

test('chunk validation', t => {
  t.is(validChunkEnd([]), -1);
  t.is(validChunkEnd([{ start: 0, end: 3 }]), 3);
  t.is(validChunkEnd([{ start: 0, end: 2 }, { start: 4, end: 5 }]), -1);
  t.is(validChunkEnd([{ start: 0, end: 3 }, { start: 4, end: 5 }]), 5);
});
