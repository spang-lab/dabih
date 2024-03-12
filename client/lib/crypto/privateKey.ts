/* global BigInt */
import base64url from './base64url';
import bigInt from './bigInt';
import publicKey from './publicKey';

const pkcs8Header = '-----BEGIN PRIVATE KEY-----';
const pkcs8Footer = '-----END PRIVATE KEY-----';

const generate = async () => {
  const { privateKey } = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt'],
  );
  return privateKey;
};

const toJWK = async (
  privateKey: CryptoKey,
) => crypto.subtle.exportKey('jwk', privateKey);

const fromJWK = async (
  keyData: object,
) => crypto.subtle.importKey(
  'jwk',
  keyData,
  {
    name: 'RSA-OAEP',
    hash: 'SHA-256',
  },
  true,
  ['decrypt'],
);

const toUint8 = async (
  privateKey: CryptoKey,
) => crypto.subtle.exportKey('pkcs8', privateKey);

const toBase64 = async (
  privateKey: CryptoKey,
) => {
  const buffer = await toUint8(privateKey);
  return base64url.fromUint8(buffer);
};
const toPEM = async (
  privateKey: CryptoKey,
) => {
  const keyString = await toBase64(privateKey);
  const content = base64url
    .toBase64(keyString)
    .replace(/.{64}/g, '$&\n');
  return `${pkcs8Header}\n${content}\n${pkcs8Footer}`;
};

const fromUint8 = async (
  keyData: ArrayBuffer,
) => crypto.subtle.importKey(
  'pkcs8',
  keyData,
  {
    name: 'RSA-OAEP',
    hash: 'SHA-256',
  },
  true,
  ['decrypt'],
);

const fromBase64 = async (base64: string) => {
  const buffer = base64url.toUint8(base64);
  return fromUint8(buffer);
};

const fromPEM = async (pemString: string) => {
  const oneLine = pemString.replace(/[\n\r]/g, '');
  const regex = new RegExp(
    `^${pkcs8Header}([a-zA-Z0-9+/]+={0,2})${pkcs8Footer}`,
  );
  const match = regex.exec(oneLine);
  if (!match || match.length !== 2) {
    throw new Error('Invalid pkcs8 Pem File');
  }
  const keyString = base64url.fromBase64(match[1]);
  return fromBase64(keyString);
};
const toJSON = async (privateKey: CryptoKey) => {
  const {
    p, q, e, d,
  } = await toJWK(privateKey);
  return JSON.stringify({
    p, q, e, d,
  });
};

const fromJSON = async (json: string) => {
  const rJWK = JSON.parse(json);
  const {
    p, q, d,
  } = rJWK;
  const na = new Uint8Array(p.length + q.length);
  na.set(p, 0);
  na.set(q, p.length);
  const pi = base64url.toBigInt(p);
  const qi = base64url.toBigInt(q);
  const ni = pi * qi;
  const di = base64url.toBigInt(d);

  const dpi = di % (pi - BigInt(1));
  const dqi = di % (qi - BigInt(1));
  const qqi = bigInt.invert(qi, pi);

  const jwkData = {
    kty: 'RSA',
    n: base64url.fromBigInt(ni),
    dp: base64url.fromBigInt(dpi),
    dq: base64url.fromBigInt(dqi),
    qi: base64url.fromBigInt(qqi),
    ...rJWK,
  };
  return fromJWK(jwkData);
};

const toPublicKey = async (privateKey: CryptoKey) => {
  const {
    n, alg, e, kty,
  } = await toJWK(privateKey);
  const jwk = {
    key_ops: ['encrypt'],
    n,
    alg,
    e,
    kty,
  };
  return publicKey.fromJWK(jwk);
};

const decrypt = async (
  privateKey: CryptoKey,
  data: ArrayBuffer,
): Promise<ArrayBuffer> => crypto.subtle.decrypt({
  name: 'RSA-OAEP',
}, privateKey, data);

const toHash = async (privateKey: CryptoKey) => {
  const pKey = await toPublicKey(privateKey);
  return publicKey.toHash(pKey);
};

export default {
  generate,
  toPublicKey,
  toJWK,
  fromJWK,
  toJSON,
  fromJSON,
  decrypt,
  toHash,
  toBase64,
  fromBase64,
  toPEM,
  fromPEM,
};
