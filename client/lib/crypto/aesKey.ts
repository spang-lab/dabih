import base64url from './base64url';

const decrypt = async (key: CryptoKey, iv: string, chunk: Blob) => {
  const rawIv = base64url.toUint8(iv);
  const buffer = await chunk.arrayBuffer();
  return crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv: rawIv,
    },
    key,
    buffer,
  );
};

const toBase64 = async (key: CryptoKey) => {
  const buffer = await crypto.subtle.exportKey('raw', key);
  return base64url.fromUint8(buffer);
};

export {
  decrypt,
  toBase64,
};
