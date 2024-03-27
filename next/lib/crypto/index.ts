import privateKey from './privateKey';
import publicKey from './publicKey';
import aesKey from './aesKey';
import base64url from './base64url';

const hash = async (data: ArrayBuffer) => {
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return base64url.fromUint8(buffer);
};

const isAvailable = () => !!crypto && !!crypto.subtle;

const cryptoLib = {
  aesKey,
  privateKey,
  publicKey,
  base64url,
  hash,
  isAvailable,
};
export default cryptoLib;
