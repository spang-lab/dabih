import { createCipheriv, createDecipheriv, createHash, scryptSync, } from 'crypto';
import base64url from './base64url';
import random from './random';
const derive = (secret, salt) => {
    const keyBytes = 32;
    const key = scryptSync(secret, salt, keyBytes);
    return base64url.fromUint8(key);
};
const generate = async () => {
    const bytes = await random.getBytes(32);
    return base64url.fromUint8(bytes);
};
const generateIv = async () => {
    const bytes = await random.getBytes(16);
    return base64url.fromUint8(bytes);
};
const encrypt = (key, iv) => {
    const rawKey = base64url.toUint8(key);
    const rawIv = base64url.toUint8(iv);
    const algorithm = 'aes-256-cbc';
    return createCipheriv(algorithm, rawKey, rawIv);
};
const decrypt = (key, iv) => {
    const rawKey = base64url.toUint8(key);
    const rawIv = base64url.toUint8(iv);
    const algorithm = 'aes-256-cbc';
    return createDecipheriv(algorithm, rawKey, rawIv);
};
const encryptString = (key, iv, data) => {
    const cipher = encrypt(key, iv);
    const encrypted = cipher.update(data, 'utf8', 'base64url');
    return encrypted + cipher.final('base64url');
};
const encryptSecret = (key, iv, data) => {
    const cipher = encrypt(key, iv);
    const encrypted = cipher.update(data, 'base64url', 'base64url');
    return encrypted + cipher.final('base64url');
};
const decryptSecret = (key, iv, data) => {
    const decipher = decrypt(key, iv);
    const decrypted = decipher.update(data, 'base64url', 'base64url');
    return decrypted + decipher.final('base64url');
};
const decryptString = (key, iv, data) => {
    const decipher = decrypt(key, iv);
    const decrypted = decipher.update(data, 'base64url', 'utf8');
    return decrypted + decipher.final('utf8');
};
const toHash = (key) => {
    const hasher = createHash('sha256');
    const buffer = base64url.toUint8(key);
    hasher.update(buffer);
    return hasher.digest('base64url');
};
const aesKey = {
    derive,
    generate,
    generateIv,
    encrypt,
    decrypt,
    encryptString,
    decryptString,
    encryptSecret,
    decryptSecret,
    toHash,
};
export default aesKey;
//# sourceMappingURL=aesKey.js.map