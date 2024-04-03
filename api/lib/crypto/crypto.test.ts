import test from 'ava';

import privateKey from './privateKey';
import publicKey from './publicKey';
import base64url from './base64url';

import {
  generateKeyPair,
  privateDecrypt,
  publicEncrypt,
} from 'node:crypto';

test('basic', t => {
  t.is(Math.sqrt(9), 3);
});

test('privateKey', async t => {
  const key = await privateKey.generate();
  t.truthy(key);
});

test('publicKey', async t => {
  const privKey = await privateKey.generate();
  const pubKey = privateKey.toPublicKey(privKey);
  t.truthy(pubKey);
});


test('toPublicKey', async t => {
  const keyPair = await privateKey.generatePair();
  const pubKey = privateKey.toPublicKey(keyPair.privateKey);
  const h1 = publicKey.toHash(keyPair.publicKey);
  const h2 = publicKey.toHash(pubKey);
  t.is(h1, h2);
});

test('base64url', t => {
  const data = 'Hello, World!';
  const value1 = base64url.fromUtf8(data);
  const buffer = base64url.toUint8(value1);
  const value2 = base64url.fromUint8(buffer);
  t.is(value1, value2);
  const base64 = base64url.toBase64(value1);
  const value3 = base64url.fromBase64(base64);
  t.is(value1, value3);
  const utf8 = base64url.toUtf8(value1);
  t.is(data, utf8);
});


test('encrypt/decrypt', async t => {
  const privKey = await privateKey.generate();
  const pubKey = privateKey.toPublicKey(privKey);
  const data = 'Hello, World!';
  const base64 = base64url.fromUtf8(data);
  const encrypted = publicKey.encrypt(pubKey, base64);
  const decrypted = privateKey.decrypt(privKey, encrypted);
  const result = base64url.toUtf8(decrypted);
  t.is(data, result);

});


