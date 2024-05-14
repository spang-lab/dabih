import test from 'ava';

import privateKey from './privateKey';
import publicKey from './publicKey';
import base64url from './base64url';
import aesKey from './aesKey';
import random from './random';
import stream from './stream';

import { Readable } from 'stream';
import { text } from 'node:stream/consumers';

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

test('aesKey', async t => {
  const key = await aesKey.generate();
  t.truthy(key);
});


test('aesKey stream encrypt/decrypt', async t => {
  const key = await aesKey.generate();
  const iv = await aesKey.generateIv();
  const data = 'Hello, World!';

  const cipher = aesKey.encrypt(key, iv);
  const decipher = aesKey.decrypt(key, iv);
  const stream = Readable.from(data);

  const result = stream.pipe(cipher).pipe(decipher)
  const data2 = await text(result);
  t.is(data, data2);
});

test('aesKey string encrypt/decrypt', async t => {
  const key = await aesKey.generate();
  const iv = await aesKey.generateIv();
  const data = 'Hello, World!';
  const encrypted = aesKey.encryptString(key, iv, data);
  const decrypted = aesKey.decryptString(key, iv, encrypted);
  t.is(data, decrypted);
});

test('aesKey derive', async t => {
  const secret = await random.getToken(10);
  const key = await aesKey.derive(secret, 'test_salt');
  const hash = aesKey.toHash(key);

  const other = await aesKey.derive(secret, 'other_salt');
  const otherHash = aesKey.toHash(other);
  t.not(hash, otherHash);
});

test('crc32 stream', async t => {
  const data = 'Hello World';
  const readStream = Readable.from(data);
  const crc = stream.crc32();
  const result = readStream.pipe(crc);
  const data2 = await text(result);
  const checksum = crc.digest();
  t.is(checksum, '4a17b156');
  t.is(data, data2);
});

test('validate stream', async t => {
  const data = 'Hello World';
  const readStream = Readable.from(data);
  const validator = stream.validate();

  const result = readStream.pipe(validator);
  const data2 = await text(result);
  const { hash, byteCount } = validator.digest();
  t.is(hash, 'pZGm1Av0IEBKARczz7exkNYsZb8LzaMrV7J32a2fFG4');
  t.is(byteCount, 11);
  t.is(data, data2);
});

