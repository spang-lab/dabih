import crypto from '#crypto';
import { requireEnv } from '#lib/env';
import redis from '#lib/redis';

const secret = requireEnv('SECRET');
const aesKey = crypto.aesKey.derive(secret, 'ephemeral');

interface AesKey {
  value: string;
  iv: string;
}
const prefix = 'aesKey';
const EX = 60 * 60;

export async function storeKey(sub: string, mnemonic: string, value: string) {
  const iv = await crypto.aesKey.generateIv();
  const encrypted = crypto.aesKey.encryptString(aesKey, iv, value);

  const key = `${prefix}:${sub}:${mnemonic}`;
  await redis.set(key, JSON.stringify({ value: encrypted, iv }), { EX });
}

export async function readKey(sub: string, mnemonic: string) {
  const key = `${prefix}:${sub}:${mnemonic}`;
  const json = await redis.get(key);
  if (!json) {
    return null;
  }
  const { value, iv } = JSON.parse(json) as AesKey;
  const decrypted = crypto.aesKey.decryptString(aesKey, iv, value);
  await redis.expire(key, EX);
  return decrypted;
}

export async function deleteKey(sub: string, mnemonic: string) {
  const key = `${prefix}:${sub}:${mnemonic}`;
  await redis.del(key);
}
