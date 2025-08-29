/* global BigInt */
import base64url from "./base64url";
import bigInt from "./bigInt";

const pkcs8Header = "-----BEGIN PRIVATE KEY-----";
const pkcs8Footer = "-----END PRIVATE KEY-----";

const generate = async () => {
  const { privateKey } = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );
  return privateKey;
};

const toJWK = async (privateKey: CryptoKey) =>
  crypto.subtle.exportKey("jwk", privateKey);

const fromJWK = async (keyData: object) =>
  crypto.subtle.importKey(
    "jwk",
    keyData,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"],
  );

const toUint8 = async (privateKey: CryptoKey) =>
  crypto.subtle.exportKey("pkcs8", privateKey);

const toBase64 = async (privateKey: CryptoKey) => {
  const buffer = await toUint8(privateKey);
  const uintArray = new Uint8Array(buffer);
  const base64 = btoa(String.fromCharCode(...uintArray));
  return base64;
};
const toPEM = async (privateKey: CryptoKey) => {
  const keyString = await toBase64(privateKey);
  const content = keyString.replace(/.{64}/g, "$&\n");
  return `${pkcs8Header}\n${content}\n${pkcs8Footer}`;
};

const toSigningKey = async (privateKey: CryptoKey) => {
  const jwk = await toJWK(privateKey);
  delete jwk.key_ops;
  delete jwk.alg;
  const key = crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["sign"],
  );
  return key;
};

const fromUint8 = async (keyData: BufferSource) =>
  crypto.subtle.importKey(
    "pkcs8",
    keyData,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"],
  );

const fromBase64 = async (base64: string) => {
  const buffer = base64url.toUint8(base64);
  return fromUint8(buffer);
};

const fromPEM = async (pemString: string) => {
  const oneLine = pemString.replace(/[\n\r]/g, "");
  const regex = new RegExp(
    `^${pkcs8Header}([a-zA-Z0-9+/]+={0,2})${pkcs8Footer}`,
  );
  const match = regex.exec(oneLine);
  if (!match || match.length !== 2) {
    throw new Error("Invalid pkcs8 Pem File");
  }
  const keyString = base64url.fromBase64(match[1]);
  return fromBase64(keyString);
};

type SmallJWK = Pick<JsonWebKey, "p" | "q" | "d" | "e">;

const toJSON = async (privateKey: CryptoKey) => {
  const jwk = await toJWK(privateKey);
  if (jwk.kty !== "RSA") {
    throw new Error(`Invalid JWK type, ${jwk.kty} needs to be RSA`);
  }
  const { p, q, e, d } = jwk;
  if (!p || !q || !d || !e) {
    throw new Error("Invalid JWK");
  }
  return JSON.stringify({
    p,
    q,
    e,
    d,
  });
};

const fromJSON = async (json: string) => {
  const rJWK = JSON.parse(json) as SmallJWK;
  const { p, q, d } = rJWK;
  if (!p || !q || !d) {
    throw new Error("Invalid JWK");
  }
  const pi = base64url.toBigInt(p);
  const qi = base64url.toBigInt(q);
  const ni = pi * qi;
  const di = base64url.toBigInt(d);

  const dpi = di % (pi - BigInt(1));
  const dqi = di % (qi - BigInt(1));
  const qqi = bigInt.invert(qi, pi);

  const jwkData = {
    kty: "RSA",
    n: base64url.fromBigInt(ni),
    dp: base64url.fromBigInt(dpi),
    dq: base64url.fromBigInt(dqi),
    qi: base64url.fromBigInt(qqi),
    ...rJWK,
  };
  return fromJWK(jwkData);
};

const toPublicKey = async (privateKey: CryptoKey) => {
  const { n, alg, e, kty } = await toJWK(privateKey);
  return crypto.subtle.importKey(
    "jwk",
    {
      key_ops: ["encrypt"],
      n,
      alg,
      e,
      kty,
    },
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"],
  );
};

const decrypt = async (
  privateKey: CryptoKey,
  data: BufferSource,
): Promise<ArrayBuffer> =>
  crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    data,
  );

const decryptAesKey = async (privateKey: CryptoKey, encrypted: string) => {
  const buffer = base64url.toUint8(encrypted);
  return decrypt(privateKey, buffer);
};

const toHash = async (privateKey: CryptoKey) => {
  const pKey = await toPublicKey(privateKey);
  const spki = await crypto.subtle.exportKey("spki", pKey);
  const buffer = await crypto.subtle.digest("SHA-256", spki);
  return base64url.fromUint8(buffer);
};

const toHex = async (privateKey: CryptoKey) => {
  const pkcs8 = await toUint8(privateKey);
  const hexData = [...new Uint8Array(pkcs8)].map((v) =>
    v.toString(16).toUpperCase().padStart(2, "0"),
  );
  return hexData;
};

const privateKey = {
  generate,
  toPublicKey,
  toJWK,
  toSigningKey,
  fromJWK,
  toJSON,
  fromJSON,
  decrypt,
  decryptAesKey,
  toHash,
  toBase64,
  toHex,
  fromBase64,
  toPEM,
  fromPEM,
};
export default privateKey;
