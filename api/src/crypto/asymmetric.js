import {
  createPrivateKey,
  createPublicKey,
  privateDecrypt,
  publicEncrypt,
  generateKeyPair,
  constants,
} from 'node:crypto';
import { promisify } from 'node:util';
import sha256 from './sha256.js';

const generateRsaKeypair = async () => {
  const generate = promisify(generateKeyPair);
  const options = {
    modulusLength: 4096,
    publicExponent: 0x10001,
  };
  const {
    publicKey,
    privateKey,
  } = await generate('rsa', options);

  const publicJwk = publicKey.export({
    format: 'jwk',
  });

  const privatePem = privateKey.export({
    type: 'pkcs8',
    format: 'pem',
  });
  return {
    publicKey: publicJwk,
    privateKey: privatePem,
  };
};

const hashKey = (key) => {
  const publicKey = createPublicKey({
    key,
    format: 'jwk',
  });
  const data = publicKey.export({
    type: 'spki',
    format: 'der',
  });
  return sha256.hash(data);
};

const encrypt = (key, buffer) => {
  const publicKey = createPublicKey({
    key,
    format: 'jwk',
  });
  const result = publicEncrypt({
    key: publicKey,
    oaepHash: 'sha256',
    padding: constants.RSA_PKCS1_OAEP_PADDING,
  }, buffer);
  return result.toString('base64url');
};

const decrypt = (key, base64) => {
  const buffer = Buffer.from(base64, 'base64url');
  const privateKey = createPrivateKey({
    key,
    format: 'pem',
  });
  const result = privateDecrypt({
    oaepHash: 'sha256',
    key: privateKey,
    padding: constants.RSA_PKCS1_OAEP_PADDING,
  }, buffer);

  return result.toString();
};

export default {
  encrypt,
  decrypt,
  hashKey,
  generateKeyPair: generateRsaKeypair,
};
