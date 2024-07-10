import privateKey from './privateKey';
import publicKey from './publicKey';
import random from './random';
import base64url from './base64url';
import aesKey from './aesKey';
import stream from './stream';
import hash from './hash';
import fileData from './fileData';

const crypto = {
  privateKey,
  publicKey,
  fileData,
  random,
  base64url,
  aesKey,
  stream,
  hash
};
export default crypto;
