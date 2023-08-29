import {
  uint8ToBase64,
  base64ToUint8,
  privateKeyToPublicKey,
  base64Tobase64Url,
  pemToPkcs8,
  pkcs8ToPem,
  CONST,
  pemToSpki,
} from './crypto-util';

export const isCryptoApiAvailable = () => {
  if (!crypto) {
    return false;
  }
  if (!crypto.subtle) {
    return false;
  }
  return true;
};

export const generateKey = async () => {
  const isExportable = true;
  const keyUses = ['encrypt', 'decrypt'];

  const {privateKey, publicKey} = await crypto.subtle.generateKey(
    CONST.rsa,
    isExportable,
    keyUses,
  );

  return {
    publicKey: await crypto.subtle.exportKey('jwk', publicKey),
    privateKey: await crypto.subtle.exportKey('pkcs8', privateKey),
  };
};

export const hashBlob = async (blob) => {
  const data = await blob.arrayBuffer();
  const buffer = await crypto.subtle.digest(CONST.hash.alg, data);
  return uint8ToBase64(buffer);
};

export const hashHashes = async (hashes) => {
  const hashSize = 32;
  const hashData = new Uint8Array(hashSize * hashes.length);
  hashes.map(base64ToUint8).forEach((array, i) => {
    hashData.set(array, i * hashSize);
  });
  const buffer = await crypto.subtle.digest(CONST.hash.alg, hashData);
  return uint8ToBase64(buffer);
};

export const hashKey = async (publicKey) => {
  const spki = await crypto.subtle.exportKey('spki', publicKey);
  const buffer = await crypto.subtle.digest(CONST.hash.alg, spki);
  return uint8ToBase64(buffer);
};

export const decryptKey = async (privateKey, encryptedKey) => {
  const encrypted = base64ToUint8(encryptedKey);

  const algorithm = {name: CONST.rsa.name};
  const decrypted = await crypto.subtle.decrypt(
    algorithm,
    privateKey,
    encrypted,
  );

  const key = await crypto.subtle.importKey(
    'raw',
    decrypted,
    {name: CONST.aes.name},
    true,
    ['decrypt'],
  );

  return key;
};

export const decryptChunk = async (aesKey, iv, chunk) => {
  const rawIv = base64ToUint8(iv);
  const buffer = await chunk.arrayBuffer();
  return crypto.subtle.decrypt(
    {
      name: CONST.aes.name,
      iv: rawIv,
    },
    aesKey,
    buffer,
  );
};

const loadPrivateKey = async (keyData) => {
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    {
      name: CONST.rsa.name,
      hash: CONST.rsa.hash,
    },
    true,
    ['decrypt'],
  );
  const publicKey = await privateKeyToPublicKey(privateKey);
  const hash = await hashKey(publicKey);
  return {
    privateKey,
    publicKey,
    hash,
  };
};

// OpenSSH .pub files have a custom format not supported by
// subtle crypto directly
const importOpenSSHPubKey = async (text) => {
  const parts = text.split(' ');
  if (parts.length !== 3) {
    throw new Error('Invalid ssh-rsa Pubkey');
  }
  // get the base64 encoded data
  const keyData = parts[1];
  const keyName = parts[2];
  const rawData = base64ToUint8(keyData);
  // The data is a byte array and has 3 segements
  const data = [];
  let current = 0;
  while (current < rawData.length) {
    // segment starts with an UInt32 length l, followed by l bytes of data
    const len = new DataView(rawData.buffer).getUint32(current, false);
    const part = rawData.slice(current + 4, current + 4 + len);
    data.push(part);
    current += len + 4;
  }
  if (data.length !== 3) {
    throw new Error('Invalid ssh-rsa public key');
  }
  const header = new TextDecoder().decode(data[0]);
  if (header !== 'ssh-rsa') {
    throw new Error(`Invalid ssh-rsa header ${header}`);
  }
  const key = {
    kty: 'RSA',
    e: base64Tobase64Url(uint8ToBase64(data[1])),
    n: base64Tobase64Url(uint8ToBase64(data[2])),
  };
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    key,
    {
      name: CONST.rsa.name,
      hash: CONST.rsa.hash,
    },
    true,
    ['encrypt'],
  );
  return publicKey;
};

export const exportJwk = async (key) => crypto.subtle.exportKey('jwk', key);
export const exportAesKey = async (key) => {
  const buffer = await crypto.subtle.exportKey('raw', key);
  return uint8ToBase64(buffer);
};

export const exportBase64 = async (key) => {
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', key);
  return uint8ToBase64(pkcs8);
};

export const importPublicKey = async (keyData) => {
  if (keyData.startsWith(CONST.opensshHeader)) {
    return importOpenSSHPubKey(keyData);
  }
  if (keyData.startsWith(CONST.spkiHeader)) {
    const raw = pemToSpki(keyData);
    const publicKey = await crypto.subtle.importKey(
      'spki',
      raw,
      CONST.rsa,
      true,
      ['encrypt'],
    );
    return publicKey;
  }
  if (keyData.startsWith(CONST.pkcs8Header)) {
    const pkcs8 = pemToPkcs8(keyData);
    const {publicKey} = await loadPrivateKey(pkcs8);
    return publicKey;
  }
  throw new Error('Unknown public key format');
};

export const importPrivateKey = async (keyData, format = 'uint8array') => {
  if (format === 'uint8array') {
    return loadPrivateKey(keyData);
  }
  if (format === 'base64') {
    const pkcs8 = base64ToUint8(keyData);
    return loadPrivateKey(pkcs8);
  }
  if (format === 'pem' && keyData.startsWith(CONST.pkcs8Header)) {
    const pkcs8 = pemToPkcs8(keyData);
    return loadPrivateKey(pkcs8);
  }
  throw new Error('Unknown private key format');
};
export const exportPrivateKey = async (key) => pkcs8ToPem(key);

export const encodeHash = (hash) => base64Tobase64Url(hash);
