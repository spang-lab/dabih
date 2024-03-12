import privateKey from './privateKey';
import publicKey from './publicKey';
import aesKey from './aesKey';
import base64url from './base64url';

const hash = async (data: ArrayBuffer) => {
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return base64url.fromUint8(buffer);
};

const isAvailable = () => !!crypto && !!crypto.subtle;

const parseFile = async (text: string) => {
  if (text.startsWith('ssh-rsa')) {
    return publicKey.fromOpenSSH(text);
  }
  const spkiHeader = '-----BEGIN PUBLIC KEY-----';
  if (text.startsWith(spkiHeader)) {
    return publicKey.fromSPKI(text);
  }
  const pkcs8Header = '-----BEGIN PRIVATE KEY-----';
  if (text.startsWith(pkcs8Header)) {
    const pKey = await privateKey.fromPEM(text);
    return privateKey.toPublicKey(pKey);
  }
  throw new Error('Unknown public key format');
};

export default {
  aesKey,
  privateKey,
  publicKey,
  parseFile,
  base64url,
  hash,
  isAvailable,
};
