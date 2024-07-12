import app from 'src/app';
import getPort from '@ava/get-port';
import { test, client } from '#ava';

import crypto from '#crypto';

import { parsePermission, toPermissionString } from '#lib/database/member';
import { Permission, PermissionString } from '../types';

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
  const api = client(t, 'test_owner', true);
  await api.test.addUser('test_owner');
  await api.test.addUser('test_member');
  await api.test.addUser('test_root', true);
  await api.test.addFile('test_file');

  await api.test.addDirectory('test_dir');
  const mnemonic = t.context.directories.test_dir;
  await api.test.addFile('dir-1', { directory: mnemonic });
  await api.test.addFile('dir-2', { directory: mnemonic });
});

test.after.always((t) => {
  t.context.server.close();
});

test('member list', async (t) => {
  const api = client(t, 'test_owner');
  const mnemonic = t.context.files.test_file;

  const { data: members, response } = await api.fs.listMembers(mnemonic);
  t.is(response.status, 200);
  if (!members) {
    t.fail();
    return;
  }
  t.is(members.length, 1);
  const [member] = members;
  t.is(member.permissionString, 'write');
  t.is(member.sub, 'test_owner');
});

test('add member', async (t) => {
  const api = client(t, 'test_owner');
  const mnemonic = t.context.files.test_file;
  const privateKey = t.context.users.test_owner;
  const { data: file } = await api.fs.file(mnemonic);
  if (!file) {
    t.fail();
    return;
  }
  const aesKey = crypto.fileData.decryptKey(privateKey, file);

  const { response: response2 } = await api.fs.addMember(mnemonic, {
    subs: ['test_member'],
    keys: [
      {
        mnemonic,
        key: aesKey,
      },
    ],
  });
  t.is(response2.status, 204);
  const api2 = client(t, 'test_member');
  const { data: file2 } = await api2.fs.file(mnemonic);
  if (!file2) {
    t.fail();
    return;
  }
  const privateKey2 = t.context.users.test_member;
  const aesKey2 = crypto.fileData.decryptKey(privateKey2, file2);
  t.is(aesKey, aesKey2);
});

test('add member to directory', async (t) => {
  const api = client(t, 'test_owner');
  const mnemonic = t.context.directories.test_dir;
  const { data: files } = await api.fs.listFiles(mnemonic);
  if (!files) {
    t.fail();
    return;
  }
  const privateKey = t.context.users.test_owner;
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const keyHash = crypto.publicKey.toHash(publicKey);
  const keys = files.map((file) => {
    const encryptedKey = file.keys.find((k) => k.hash === keyHash);
    if (!encryptedKey) {
      t.fail(`Failed to find key for file ${file.mnemonic}`);
      throw new Error('Failed to find key');
    }
    const aesKey = crypto.privateKey.decrypt(privateKey, encryptedKey.key);
    return {
      mnemonic: file.mnemonic,
      key: aesKey,
    };
  });
  const { response } = await api.fs.addMember(mnemonic, {
    subs: ['test_member'],
    keys,
  });
  t.is(response.status, 204);
  const api2 = client(t, 'test_member');
  const { data: files2 } = await api2.fs.listFiles(mnemonic);
  if (!files2) {
    t.fail();
    return;
  }
  const privateKey2 = t.context.users.test_member;
  const publicKey2 = crypto.privateKey.toPublicKey(privateKey2);
  const keyHash2 = crypto.publicKey.toHash(publicKey2);
  files2.forEach((file) => {
    const encryptedKey = file.keys.find((k) => k.hash === keyHash2);
    if (!encryptedKey) {
      t.fail(`Failed to find key for file ${file.mnemonic}`);
      throw new Error('Failed to find key');
    }
    const aesKey2 = crypto.privateKey.decrypt(privateKey2, encryptedKey.key);
    const aesKey = keys.find((k) => k.mnemonic === file.mnemonic)?.key;
    t.is(aesKey, aesKey2);
  });
});

test('root access', async (t) => {
  const api = client(t, 'test_root', true);
  const mnemonic = t.context.files.test_file;
  const { data: file } = await api.fs.file(mnemonic);
  if (!file) {
    t.fail();
    return;
  }
  const privateKey = t.context.users.test_root;
  const publicKey = crypto.privateKey.toPublicKey(privateKey);
  const keyHash = crypto.publicKey.toHash(publicKey);
  const encryptedKey = file.keys.find((k) => k.hash === keyHash);
  if (!encryptedKey) {
    t.fail();
    return;
  }
  const aesKey = crypto.privateKey.decrypt(privateKey, encryptedKey.key);
  const aesHash = crypto.aesKey.toHash(aesKey);
  t.is(aesHash, file.data.keyHash);
});

test('permission parsing', (t) => {
  const testCases = [
    { input: 'none', expected: Permission.NONE, output: 'none' },
    { input: 'read', expected: Permission.READ, output: 'read' },
    { input: 'write', expected: Permission.WRITE, output: 'write' },
    { input: 'Write', expected: Permission.WRITE, output: 'write' },
    { input: 'rEAd', expected: Permission.READ, output: 'read' },
    { input: 'w', expected: Permission.WRITE, output: 'write' },
    { input: 'r', expected: Permission.READ, output: 'read' },
    { input: 'n', expected: Permission.NONE, output: 'none' },
  ];
  for (const { input, expected, output } of testCases) {
    t.is(parsePermission(input), expected);
    t.is(toPermissionString(expected), output as PermissionString);
  }
  t.throws(() => parsePermission('invalid_permission'));
});
