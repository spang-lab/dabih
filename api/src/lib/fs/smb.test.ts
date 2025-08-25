import test from 'ava';

import { parseSmbUri } from './smb';

test('parseSMBUri', (t) => {
  const smbUrl =
    'smb://DOMAIN;myuser:testpassword@smb.test.de:445/testshare/folder/file.txt';
  const parsed = parseSmbUri(smbUrl);
  t.deepEqual(parsed, {
    domain: 'DOMAIN',
    user: 'myuser',
    password: 'testpassword',
    server: 'smb.test.de',
    port: 445,
    share: 'testshare',
    path: 'folder/file.txt',
  });

  const smbUrlNoDomain =
    'smb://myuser:testpassword@smb.test.de:445/testshare/folder/file.txt';
  const parsedNoDomain = parseSmbUri(smbUrlNoDomain);
  t.deepEqual(parsedNoDomain, {
    user: 'myuser',
    password: 'testpassword',
    server: 'smb.test.de',
    port: 445,
    share: 'testshare',
    path: 'folder/file.txt',
  });

  const smbUrlNoPort =
    'smb://myuser:testpassword@smb.test.de/testshare/folder/file.txt';
  const parsedNoPort = parseSmbUri(smbUrlNoPort);
  t.deepEqual(parsedNoPort, {
    user: 'myuser',
    password: 'testpassword',
    server: 'smb.test.de',
    port: 445,
    share: 'testshare',
    path: 'folder/file.txt',
  });
});
