import anyTest, { TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';

const test = anyTest as TestFn<{ server: Server, port: number }>;
import client from '#lib/client';
import getPort from '@ava/get-port';
import crypto from '#crypto';

test.before(async t => {
  const port = await getPort();
  t.context = {
    server: await app(port),
    port,
  };
})

test.after.always(t => {
  t.context.server.close();
})

test('upload start without key', async t => {
  const api = client(t.context.port);
  const { response } = await api.upload.start({
    fileName: "test.txt",
  });
  t.is(response.status, 400);
});

test('upload start', async t => {
  const api = client(t.context.port);
  const { publicKey } = await crypto.privateKey.generatePair();
  const jwk = crypto.publicKey.toJwk(publicKey);
  const { response, data: user } = await api.user.add({
    name: "test",
    email: "test",
    key: jwk,
  });
  t.is(response.status, 201);
  if (!user) {
    t.fail('No data');
    return;
  }
  const { response: response2, data: dataset } = await api.upload.start({
    fileName: "test.txt",
  });
  t.is(response2.status, 201);
  if (!dataset) {
    t.fail('No dataset');
    return;
  }

  const { response: response3 } = await api.upload.cancel(dataset.mnemonic);
  t.is(response3.status, 204);
  const { response: response4 } = await api.user.remove(user.sub);
  t.is(response4.status, 204);
});


test('upload chunk', async t => {
  const api = client(t.context.port);
  const { publicKey } = await crypto.privateKey.generatePair();
  const jwk = crypto.publicKey.toJwk(publicKey);
  const { response, data: user, error } = await api.user.add({
    name: "test",
    email: "test",
    key: jwk,
  });
  t.log(error);
  t.is(response.status, 201);
  if (!user) {
    t.fail('No data');
    return;
  }
  const { response: response2, data: dataset } = await api.upload.start({
    fileName: "test.txt",
  });
  t.is(response2.status, 201);
  if (!dataset) {
    t.fail('No dataset');
    return;
  }
  const { mnemonic } = dataset;

  const { response: response4, error: error2 } = await api.upload.chunk({
    mnemonic,
    start: 0,
    end: 3,
    size: 4,
    hash: 'hash',
    data: new Blob(['test']),
  });
  console.log(response4);
  t.log(response4);
  t.log(error2);

  t.is(response4.status, 201);




});

