/* eslint-env jest */

import aes from './symmetric.js';

test('AES Key derive', async () => {
  const secret = 'This is a test secret';
  const key = await aes.deriveKey(secret);
  const iv = await aes.randomIv();
  const testPayload = 'hello';
  const encrypted = await aes.encryptString(key, iv, testPayload);

  const key2 = await aes.deriveKey(secret);

  const decrypted = await aes.decryptString(key2, iv, encrypted);
  expect(decrypted).toEqual(testPayload);
});

test('AES Symmetric Encryption', async () => {
  const testPayload = 'This string will be encrypted and then decrypted';
  const key = await aes.randomKey();
  const iv = await aes.randomIv();
  const encrypted = await aes.encryptString(key, iv, testPayload);
  const decrypted = await aes.decryptString(key, iv, encrypted);
  expect(decrypted).toEqual(testPayload);
});

test('AES Invalid Iv', async () => {
  const testPayload = 'This string will be encrypted and then decrypted';
  const key = await aes.randomKey();
  const iv = await aes.randomIv();
  const encrypted = await aes.encryptString(key, iv, testPayload);

  // intenionally bad iv
  const badiv = new Uint8Array(16);
  const decrypted = await aes.decryptString(key, badiv, encrypted);
  expect(decrypted).not.toEqual(testPayload);
});

test('AES Invalid Key', async () => {
  const testPayload = 'This string will be encrypted and then decrypted';
  const key = await aes.randomKey();
  const iv = await aes.randomIv();
  const encrypted = await aes.encryptString(key, iv, testPayload);

  // intenionally bad key
  const badkey = new Uint8Array(32);

  const decrypt = async () => aes.decryptString(badkey, iv, encrypted);

  expect(decrypt).rejects.toThrow();
});
