/* eslint-env jest */
import crypto from 'node:crypto';
import asymmetric from './asymmetric.js';
import { pkcs8ToPem } from './util.js';

const generateClientKey = async () => {
  const params = {
    name: 'RSA-OAEP',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  };
  const isExportable = true;
  const keyUses = ['encrypt', 'decrypt'];

  const { privateKey, publicKey } = await crypto.subtle.generateKey(
    params,
    isExportable,
    keyUses,
  );
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', privateKey);
  const pem = pkcs8ToPem(pkcs8);

  return {
    publicKey: await crypto.subtle.exportKey('jwk', publicKey),
    privateKey: pem,
  };
};

test('RSA encrypt client', async () => {
  const { publicKey, privateKey } = await generateClientKey();
  const payload = 'TEST PAYLOAD';
  const encrypted = asymmetric.encrypt(publicKey, payload);

  const decrypted = asymmetric.decrypt(privateKey, encrypted);

  expect(payload).toEqual(decrypted);
});

test('RSA encrypt root', async () => {
  const { publicKey, privateKey } = await asymmetric.generateKeyPair();
  const payload = 'TESTY PAYLOAD';
  const encrypted = asymmetric.encrypt(publicKey, payload);

  const decrypted = asymmetric.decrypt(privateKey, encrypted);

  expect(payload).toEqual(decrypted);
});

test('consistent key hash', async () => {
  const { publicKey } = await asymmetric.generateKeyPair();
  const similarKey = {
    ...publicKey,
    alg: 'RSA-OAEP-256',
  };

  const hashA = asymmetric.hashKey(publicKey);
  const hashB = asymmetric.hashKey(similarKey);

  expect(hashA).toEqual(hashB);
});

test('invalid key in hash', async () => {
  const { publicKey } = await asymmetric.generateKeyPair();
  delete publicKey.n;

  const hash = () => asymmetric.hashKey(publicKey);

  expect(hash).toThrow();
});
