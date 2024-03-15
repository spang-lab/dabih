import base64url from './base64url';
import privateKey from './privateKey';

const spkiHeader = '-----BEGIN PUBLIC KEY-----';
const spkiFooter = '-----END PUBLIC KEY-----';

const fromJWK = async (jwk: any) => crypto.subtle.importKey(
  'jwk',
  jwk,
  {
    name: 'RSA-OAEP',
    hash: 'SHA-256',
  },
  true,
  ['encrypt'],
);

const fromOpenSSH = async (text: string) => {
  const parts = text.split(' ');
  if (parts.length !== 3) {
    throw new Error('Invalid ssh-rsa Pubkey');
  }
  const keyStr = base64url.fromBase64(parts[1]);
  const keyData = base64url.toUint8(keyStr);
  const data: ArrayBuffer[] = [];
  let current = 0;
  while (current < keyData.length) {
    // segment starts with an UInt32 length l, followed by l bytes of data
    const len = new DataView(keyData.buffer).getUint32(current, false);
    const part = keyData.slice(current + 4, current + 4 + len);
    data.push(part);
    current += len + 4;
  }
  if (data.length !== 3) {
    throw new Error('Invalid ssh-rsa public key');
  }
  const headerB = base64url.fromUint8(data[0]);
  const header = base64url.toString(headerB);
  if (header !== 'ssh-rsa') {
    throw new Error(`Invalid ssh-rsa header ${header}`);
  }
  const key = {
    kty: 'RSA',
    e: base64url.fromUint8(data[1]),
    n: base64url.fromUint8(data[2]),
  };
  return fromJWK(key);
};

const fromSPKI = async (spkiString: string) => {
  const oneLine = spkiString.replace(/[\n\r]/g, '');
  const regex = new RegExp(
    `^${spkiHeader}([a-zA-Z0-9+/]+={0,2})${spkiFooter}`,
  );
  const match = regex.exec(oneLine);
  if (!match || match.length !== 2) {
    throw new Error('Invalid pkcs8 Pem File');
  }
  const keyString = base64url.fromBase64(match[1]);
  const keyData = base64url.toUint8(keyString);
  const key = await crypto.subtle.importKey(
    'spki',
    keyData,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt'],
  );
  return key;
};

const toHash = async (publicKey: CryptoKey) => {
  const spki = await crypto.subtle.exportKey('spki', publicKey);
  const buffer = await crypto.subtle.digest('SHA-256', spki);
  return base64url.fromUint8(buffer);
};
const toJWK = async (
  publicKey: CryptoKey,
) => crypto.subtle.exportKey('jwk', publicKey);

const toJSON = async (
  publicKey: CryptoKey,
) => {
  const jwk = await toJWK(publicKey);
  return JSON.stringify(jwk);
};

const fromFile = async (text: string) => {
  if (text.startsWith('ssh-rsa')) {
    return fromOpenSSH(text);
  }
  if (text.startsWith(spkiHeader)) {
    return fromSPKI(text);
  }
  const pkcs8Header = '-----BEGIN PRIVATE KEY-----';
  if (text.startsWith(pkcs8Header)) {
    const pKey = await privateKey.fromPEM(text);
    return privateKey.toPublicKey(pKey);
  }
  throw new Error('Unknown public key format');
};

const encrypt = async (
  publicKey: CryptoKey,
  data: ArrayBuffer,
): Promise<ArrayBuffer> => crypto.subtle.encrypt({
  name: 'RSA-OAEP',
}, publicKey, data);

export default {
  fromJWK,
  fromOpenSSH,
  fromFile,
  toJWK,
  toJSON,
  fromSPKI,
  toHash,
  encrypt,
};
