import app from 'src/app';
import getPort from '@ava/get-port';
import { test } from '#ava';
import { parseSmbUri } from './smb';

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
});

test.after.always((t) => {
  t.context.server.close();
});

test('parseSMBUri', (t) => {
  const smbUrl =
    'smb://DOMAIN;myuser:testpassword@smb.test.de:445/testshare/folder/file.txt';
  const parsed = parseSmbUri(smbUrl);
  t.deepEqual(parsed, {
    domain: 'DOMAIN',
    user: 'myuser',
    password: 'testpassword',
    host: 'smb.test.de',
    port: 445,
    share: 'testshare',
    path: 'folder/file.txt',
  });

  const smbUrlNoDomain =
    'smb://myuser:testpassword@smb.test.de:445/testshare/folder/file.txt';
  const parsedNoDomain = parseSmbUri(smbUrlNoDomain);
  t.deepEqual(parsedNoDomain, {
    domain: 'WORKGROUP',
    user: 'myuser',
    password: 'testpassword',
    host: 'smb.test.de',
    port: 445,
    share: 'testshare',
    path: 'folder/file.txt',
  });

  const smbUrlNoPort =
    'smb://myuser:testpassword@smb.test.de/testshare/folder/file.txt';
  const parsedNoPort = parseSmbUri(smbUrlNoPort);
  t.deepEqual(parsedNoPort, {
    domain: 'WORKGROUP',
    user: 'myuser',
    password: 'testpassword',
    host: 'smb.test.de',
    port: 445,
    share: 'testshare',
    path: 'folder/file.txt',
  });
});
