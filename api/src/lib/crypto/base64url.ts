
const toUint8 = (base64url: string) =>
  Buffer.from(base64url, 'base64url')

const fromUint8 = (data: Uint8Array) =>
  Buffer.from(data).toString('base64url');

const toBase64 = (base64url: string) =>
  Buffer.from(base64url, 'base64url').toString('base64');

const fromBase64 = (base64: string) =>
  Buffer.from(base64, 'base64').toString('base64url');

const fromUtf8 = (utf8: string) =>
  Buffer.from(utf8).toString('base64url');

const toUtf8 = (base64url: string) =>
  Buffer.from(base64url, 'base64url').toString('utf8');




const base64url = {
  toUint8,
  fromUint8,
  fromUtf8,
  toUtf8,
  toBase64,
  fromBase64
};
export default base64url;
