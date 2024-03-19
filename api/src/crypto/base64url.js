const toUint8 = (base64url) => new Uint8Array(Buffer.from(base64url, 'base64url'));
const fromUint8 = (data) => Buffer.from(data).toString('base64url');

export default {
  toUint8,
  fromUint8,
};
