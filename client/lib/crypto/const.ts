export default {
  rsa: {
    name: 'RSA-OAEP',
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  },
  aes: {
    name: 'AES-CBC',
  },
  hash: {
    alg: 'SHA-256',
  },
  openssh: {
    header: 'ssh-rsa',
  },
  pkcs8: {
    header: '-----BEGIN PRIVATE KEY-----',
    footer: '-----END PRIVATE KEY-----',
  },
  spki: {
    header: '-----BEGIN PUBLIC KEY-----',
    footer: '-----END PUBLIC KEY-----',
  },
};
