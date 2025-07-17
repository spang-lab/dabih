import crypto from '#crypto';
import { requireEnv } from '#lib/env';
import redis from '#lib/redis';
const prefix = 'secret:';
const secret = requireEnv('SECRET');
const aesKey = crypto.aesKey.derive(secret, 'secrets');
export const SECRET = {
    AUTH: 'auth',
    EMAIL: 'email',
};
export async function init() {
    const oneDay = 60 * 60 * 24;
    await getSecret(SECRET.AUTH, oneDay);
    await getSecret(SECRET.EMAIL, oneDay);
}
export async function clearSecrets(secretName) {
    const key = `${prefix}:${secretName}`;
    await redis.del(key);
}
export async function getSecret(secretName, ttl) {
    const key = `${prefix}:${secretName}`;
    const secrets = await redis.lRange(key, 0, 0);
    let secret;
    if (secrets.length === 0) {
        secret = await generateSecret(secretName, ttl);
    }
    else {
        secret = JSON.parse(secrets[0]);
    }
    const now = Math.floor(Date.now() / 1000);
    if (secret.expiresAt < now) {
        secret = await generateSecret(secretName, ttl);
    }
    const { encrypted, iv } = secret;
    try {
        const decrypted = crypto.aesKey.decryptString(aesKey, iv, encrypted);
        return decrypted;
    }
    catch {
        throw new Error(`Failed to decrypt secret, aesKey: ${aesKey}, iv: ${iv}, encrypted: ${encrypted}`);
    }
}
export async function getSecrets(secretName) {
    const key = `${prefix}:${secretName}`;
    const secrets = await redis.lRange(key, 0, -1);
    const values = secrets.map((s) => {
        const { encrypted, iv } = JSON.parse(s);
        return crypto.aesKey.decryptString(aesKey, iv, encrypted);
    });
    return values;
}
export async function generateSecret(secretName, ttl) {
    const key = `${prefix}:${secretName}`;
    const now = Math.floor(Date.now() / 1000);
    const oneDay = 60 * 60 * 24;
    const expiresAt = ttl !== undefined ? now + ttl : now + oneDay;
    const value = await crypto.random.getToken(32);
    const iv = await crypto.aesKey.generateIv();
    const encrypted = crypto.aesKey.encryptString(aesKey, iv, value);
    const secret = {
        encrypted,
        iv,
        expiresAt,
    };
    await redis.lPush(key, JSON.stringify(secret));
    const maxSecrets = 5;
    await redis.lTrim(key, 0, maxSecrets - 1);
    return secret;
}
//# sourceMappingURL=secrets.js.map