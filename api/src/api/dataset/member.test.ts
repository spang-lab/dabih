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
  const api = client(port, "test_user");
  const privateKey = await crypto.privateKey.generate();
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const jwk = crypto.publicKey.toJwk(publicKey);
  await api.user.add({
    name: "test_user",
    email: "test_user@test.com",
    key: jwk,
  });

  const privateKey2 = await crypto.privateKey.generate();
  const publicKey2 = crypto.privateKey.toPublicKey(privateKey2);
  const jwk2 = crypto.publicKey.toJwk(publicKey2);
  await api.user.add({
    name: "test_user2",
    email: "test_user2@test.com",
    key: jwk2,
  });

  const data = new Blob(["test data"]);
  await api.uploadBlob("test.txt", data);

  t.context = {
    server,
    privateKey,
    port,
  };
})

test.after.always(t => {
  t.context.server.close();
})

