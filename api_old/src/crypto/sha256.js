/* eslint-disable no-underscore-dangle, no-bitwise */
import { Transform } from 'node:stream';
import { createHash } from 'node:crypto';
import base64url from './base64url.js';

class SHA256Stream extends Transform {
  constructor(options) {
    super(options);
    this.hash = createHash('sha256');
  }

  _transform(chunk, encoding, callback) {
    if (encoding !== 'buffer') {
      throw new Error(`Unsupported Encoding ${encoding}`);
    }
    if (chunk) {
      this.hash.update(chunk);
      this.push(chunk, encoding);
    }
    callback();
  }

  digest(encoding = 'base64url') {
    return this.hash.digest(encoding);
  }
}

const hash = (buffer, encoding = 'base64url') => {
  const hasher = createHash('sha256');
  hasher.update(buffer);
  return hasher.digest(encoding);
};

const hashKey = (aesKey) => {
  const hasher = createHash('sha256');
  const buffer = base64url.toUint8(aesKey);
  hasher.update(buffer);
  return hasher.digest('base64url');
};

const hashChunks = (chunks) => {
  const hasher = createHash('sha256');
  chunks.forEach((chunk) => {
    hasher.update(chunk.hash, 'base64url');
  });
  return hasher.digest('base64url');
};

export default {
  createStream: () => new SHA256Stream(),
  hash,
  hashKey,
  hashChunks,
};