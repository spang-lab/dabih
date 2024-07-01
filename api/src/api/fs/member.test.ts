import anyTest, { TestFn } from 'ava';
import app from 'src/app';
import { Server } from 'http';

const test = anyTest as TestFn<{ server: Server, port: number, mnemonic: string, keys: KeyObject[] }>;
import client from '#lib/client';
import getPort from '@ava/get-port';
import crypto from '#crypto';
import { KeyObject } from 'crypto';

import { Permission, parsePermission, toPermissionString } from '#lib/database/member';
import { PermissionString } from '../types';

test.before(async t => {
  const port = await getPort();
  const server = await app(port);
  const api = client(port, "test_owner", true);
  const privateKey = await crypto.privateKey.generate();
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const jwk = crypto.publicKey.toJwk(publicKey);
  await api.user.add({
    sub: "test_owner",
    name: "test_owner",
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
  const { data: dataset } = await api.upload.blob({ fileName: "membership.txt", data, tag: "member_test" });
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

test('member list', async t => {
  const api = client(t.context.port, "test_owner");
  const { mnemonic } = t.context;
  const { data: members, response } = await api.fs.listMembers(mnemonic);
  t.is(response.status, 200);
  if (!members) {
    t.fail();
    return;
  }
  t.is(members.length, 1);
  const [member] = members;
  t.is(member.permissionString, "write");
  t.is(member.sub, "test_owner");
});

test('add member', async t => {
  const api = client(t.context.port, "test_owner");
  const { mnemonic } = t.context;
  const { data: file, response } = await api.fs.file(mnemonic);
  const privateKey = t.context.keys[0];
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const keyHash = crypto.publicKey.toHash(publicKey);
  t.is(response.status, 200);
  if (!file) {
    t.fail();
    return;
  }
  const encryptedKey = file.data.keys.find(k => k.hash === keyHash);
  if (!encryptedKey) {
    t.fail();
    return;
  }
  const aesKey = crypto.privateKey.decrypt(privateKey, encryptedKey.key);
  const aesHash = crypto.aesKey.toHash(aesKey);
  t.is(aesHash, file.data.keyHash);

  const { response: response2 } = await api.fs.addMember(mnemonic, {
    subs: ["test_member"],
    keys: [{
      mnemonic,
      key: aesKey,
    }],
  });
  t.is(response2.status, 204);
  const api2 = client(t.context.port, "test_member");
  const { data: dataset2 } = await api2.fs.file(mnemonic);
  if (!dataset2) {
    t.fail();
    return;
  }
  const privateKey2 = t.context.keys[1];
  const publicKey2 = crypto.privateKey.toPublicKey(privateKey2);
  const keyHash2 = crypto.publicKey.toHash(publicKey2);
  const encryptedKey2 = dataset2.data.keys.find(k => k.hash === keyHash2);
  if (!encryptedKey2) {
    t.fail();
    return;
  }
  const aesKey2 = crypto.privateKey.decrypt(privateKey2, encryptedKey2.key);
  const aesHash2 = crypto.aesKey.toHash(aesKey2);
  t.is(aesHash, aesHash2);
})

test('permission parsing', t => {
  const testCases = [
    { input: "none", expected: Permission.NONE, output: "none" },
    { input: "read", expected: Permission.READ, output: "read" },
    { input: "write", expected: Permission.WRITE, output: "write" },
    { input: "Write", expected: Permission.WRITE, output: "write" },
    { input: "rEAd", expected: Permission.READ, output: "read" },
    { input: "w", expected: Permission.WRITE, output: "write" },
    { input: "r", expected: Permission.READ, output: "read" },
    { input: "n", expected: Permission.NONE, output: "none" },
  ];
  for (const { input, expected, output } of testCases) {
    t.is(parsePermission(input), expected);
    t.is(toPermissionString(expected), output as PermissionString);
  }
  t.throws(() => parsePermission("invalid_permission"));
})
