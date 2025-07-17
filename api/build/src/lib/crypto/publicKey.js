import { createPublicKey, publicEncrypt, constants, createHash, } from 'node:crypto';
import base64url from './base64url';
const fromJwk = (key) => {
    const publicKey = createPublicKey({
        key,
        format: 'jwk',
    });
    return publicKey;
};
const toJwk = (key) => {
    const jwk = key.export({
        format: 'jwk',
    });
    return jwk;
};
const fromString = (key) => {
    const jwk = JSON.parse(key);
    return fromJwk(jwk);
};
const toString = (key) => {
    const jwk = toJwk(key);
    return JSON.stringify(jwk);
};
const encrypt = (key, base64) => {
    const buffer = base64url.toUint8(base64);
    const result = publicEncrypt({
        key,
        oaepHash: 'sha256',
        padding: constants.RSA_PKCS1_OAEP_PADDING,
    }, buffer);
    return base64url.fromUint8(result);
};
const toHash = (key) => {
    const hasher = createHash('sha256');
    const buffer = key.export({ type: 'spki', format: 'der' });
    hasher.update(buffer);
    return hasher.digest('base64url');
};
const publicKey = {
    fromJwk,
    toJwk,
    toString,
    fromString,
    toHash,
    encrypt,
};
export default publicKey;
//# sourceMappingURL=publicKey.js.map