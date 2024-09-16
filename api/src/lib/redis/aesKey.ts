import crypto from '#crypto';
import { getEnv } from '#lib/env';
import redis from '#lib/redis';

let aesKey: string | null = null;

export async function init() {
  const randomSecret = await crypto.random.getToken(10);
  const s = getEnv('EPHEMERAL_SECRET', randomSecret);
  aesKey = await crypto.aesKey.derive(s, 'ephemeral');
}

export async function storeKey(sub: string, mnemonic: string, key: string) {
  const iv = await crypto.aesKey.generateIv();
  const encrypted = crypto.aesKey.encryptString(aesKey!, iv, key);
  const oneHour = 60 * 60;
  const ex = { EX: oneHour };
  await redis.set(`iv:${sub}:${mnemonic}`, iv, ex);
  await redis.set(`aesKey:${sub}:${mnemonic}`, encrypted, ex);
}

export async function readKey(sub: string, mnemonic: string) {
  const iv = await redis.get(`iv:${sub}:${mnemonic}`);
  const encrypted = await redis.get(`aesKey:${sub}:${mnemonic}`);
  if (!encrypted || !iv) {
    return null;
  }
  const key = crypto.aesKey.decryptString(aesKey!, iv, encrypted);
  await redis.expire(`iv:${sub}:${mnemonic}`, 60 * 60);
  await redis.expire(`aesKey:${sub}:${mnemonic}`, 60 * 60);
  return key;
}

export async function deleteKey(sub: string, mnemonic: string) {
  await redis.del(`iv:${sub}:${mnemonic}`);
  await redis.del(`aesKey:${sub}:${mnemonic}`);
}
