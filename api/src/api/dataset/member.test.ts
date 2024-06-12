import anyTest, { TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';

const test = anyTest as TestFn<{ server: Server, port: number, mnemonic: string, keys: KeyObject[] }>;
import client from '#lib/client';
import getPort from '@ava/get-port';
import crypto from '#crypto';
import { KeyObject } from 'crypto';

test.before(async t => {
  const port = await getPort();
  const server = await app(port);
  const api = client(port, "test_uploader");
  const privateKey = await crypto.privateKey.generate();
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const jwk = crypto.publicKey.toJwk(publicKey);
  await api.user.add({
    sub: "test_uploader",
    name: "test_uploader",
    email: "a@b.com",
    key: jwk,
  });

  const privateKey2 = await crypto.privateKey.generate();
  const publicKey2 = crypto.privateKey.toPublicKey(privateKey2);
  const jwk2 = crypto.publicKey.toJwk(publicKey2);
  await api.user.add({
    sub: "test_member",
    name: "test_user2",
    email: "a@b.com",
    key: jwk2,
  });

  const data = new Blob(["test data"]);
  const { data: dataset } = await api.upload.blob({ fileName: "membership.txt", data, name: "member_test" });
  const mnemonic = dataset!.mnemonic;

  t.context = {
    server,
    keys: [privateKey, privateKey2],
    mnemonic,
    port,
  };
})

test.after.always(t => {
  t.context.server.close();
})

test('add member', async t => {
  const api = client(t.context.port, "test_uploader");
  const { mnemonic } = t.context;
  const { data: dataset, response } = await api.dataset.get(mnemonic);
  const privateKey = t.context.keys[0];
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const keyHash = crypto.publicKey.toHash(publicKey);
  t.is(response.status, 200);
  if (!dataset) {
    t.fail();
    return;
  }
  const encryptedKey = dataset.keys.find(k => k.publicKeyHash === keyHash);
  if (!encryptedKey) {
    t.fail();
    return;
  }
  const aesKey = crypto.privateKey.decrypt(privateKey, encryptedKey.key);
  const aesHash = crypto.aesKey.toHash(aesKey);
  t.is(aesHash, dataset.keyHash);

  const { response: response2 } = await api.dataset.addMember(mnemonic, {
    sub: "test_member",
    key: aesKey,
  });
  t.is(response2.status, 204);
  const api2 = client(t.context.port, "test_member");
  const { data: dataset2 } = await api2.dataset.get(mnemonic);
  if (!dataset2) {
    t.fail();
    return;
  }
  const privateKey2 = t.context.keys[1];
  const publicKey2 = crypto.privateKey.toPublicKey(privateKey2);
  const keyHash2 = crypto.publicKey.toHash(publicKey2);
  const encryptedKey2 = dataset2.keys.find(k => k.publicKeyHash === keyHash2);
  if (!encryptedKey2) {
    t.fail();
    return;
  }
  const aesKey2 = crypto.privateKey.decrypt(privateKey2, encryptedKey2.key);
  const aesHash2 = crypto.aesKey.toHash(aesKey2);
  t.is(aesHash, aesHash2);
})
