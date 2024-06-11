import anyTest, { TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';

const test = anyTest as TestFn<{ server: Server, port: number, privateKey: KeyObject }>;
import client from '#lib/client';
import getPort from '@ava/get-port';
import crypto from '#crypto';
import { KeyObject, createHash } from 'crypto';
import { blob } from 'stream/consumers';

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
  await api.uploadBlob("test.txt", data, "test_tag");
  await api.uploadBlob("test2.txt", data);
  await api.uploadBlob("test3.txt", data);
  await api.uploadBlob("test_aXd7de.txt", data);
  const { data: dataset } = await api.uploadBlob("test_bXd7de.txt", data);
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

test('search', async t => {
  const api = client(t.context.port, "test_user");
  const { response } = await api.dataset.search({
    query: "test",
  });
  t.is(response.status, 200);
});

test('search no query', async t => {
  const api = client(t.context.port, "test_user");
  const { response, data } = await api.dataset.search({});
  if (!data) {
    t.fail();
    return;
  }
  const { count, datasets } = data;
  t.true(count >= 4);
  t.is(count, datasets.length);
  t.is(response.status, 200);
});

test('search specific dataset', async t => {
  const api = client(t.context.port, "test_user");
  const { response, data } = await api.dataset.search({
    query: "aXd7de",
  });
  if (!data) {
    t.fail();
    return;
  }
  const { count, datasets } = data;
  t.is(count, 1);
  t.is(datasets.length, 1);
  t.is(response.status, 200);
});


test('search limit', async t => {
  const api = client(t.context.port, "test_user");
  const { response, data } = await api.dataset.search({
    query: "test",
    skip: 1,
    take: 2,
  });
  if (!data) {
    t.fail();
    return;
  }
  const { count, datasets } = data;
  t.true(count >= 4);
  t.is(datasets.length, 2);
  t.is(response.status, 200);
});

test('search sort', async t => {
  const api = client(t.context.port, "test_user");
  const { response, data } = await api.dataset.search({
    query: "test",
    sortBy: "fileName",
    sortDir: "asc",
  });
  if (!data) {
    t.fail();
    return;
  }
  const { count, datasets } = data;
  t.is(count, 4);
  t.is(datasets.length, 4);
  t.is(datasets[0].fileName, "test.txt");
  t.is(datasets[1].fileName, "test2.txt");
  t.is(datasets[2].fileName, "test3.txt");
  t.is(datasets[3].fileName, "test_aXd7de.txt");
  t.is(response.status, 200);
});

test('other user', async t => {
  const api = client(t.context.port, "other_user");
  const { response, data } = await api.dataset.search({
    query: "test",
  });
  if (!data) {
    t.fail();
    return;
  }
  const { count, datasets } = data;
  t.is(count, 0);
  t.is(datasets.length, 0);
  t.is(response.status, 200);
});

test('search all', async t => {
  const api = client(t.context.port, "other_user");
  const { response, data } = await api.dataset.search({
    query: "test",
    showAll: true,
  });
  if (!data) {
    t.fail();
    return;
  }
  const { count, datasets } = data;
  t.true(count >= 4);
  t.true(datasets.length >= 4);
  t.is(response.status, 200);
});

test('search deleted', async t => {
  const api = client(t.context.port, "test_user");
  const { response, data } = await api.dataset.search({
    query: "test",
    showDeleted: true,
  });
  if (!data) {
    t.fail();
    return;
  }
  const { count, datasets } = data;
  t.is(count, 5);
  t.is(datasets.length, 5);
  t.is(response.status, 200);
});

test('search by name', async t => {
  const api = client(t.context.port, "test_user");
  const { response, data } = await api.dataset.search({
    name: "test_tag",
  });
  if (!data) {
    t.fail();
    return;
  }
  const { count, datasets } = data;
  t.is(count, 1);
  t.is(datasets.length, 1);
  t.is(response.status, 200);
});

test('search by hash', async t => {
  const blob = new Blob(["test data"]);
  const inner = createHash('sha256');
  const outer = createHash('sha256');
  const buffer = Buffer.from(await blob.arrayBuffer());
  inner.update(buffer);
  outer.update(inner.digest());
  const hash = outer.digest('base64url');
  const api = client(t.context.port, "test_user");
  const { response, data } = await api.dataset.search({
    hash,
  });
  if (!data) {
    t.fail();
    return;
  }
  const { count, datasets } = data;
  t.true(count >= 4);
  t.true(datasets.length >= 4);
  t.is(response.status, 200);
});



