/* eslint-disable no-underscore-dangle, no-bitwise */
import { Transform } from 'node:stream';

import {
  createHash,
  BinaryToTextEncoding,
  Hash
} from 'node:crypto';
import crc32 from 'crc/calculators/crc32';



class SHA256Stream extends Transform {
  private hash: Hash;
  constructor() {
    super({});
    this.hash = createHash('sha256');
  }

  _transform(chunk: Buffer, encoding: string, callback: () => void) {
    if (encoding !== 'buffer') {
      throw new Error(`Unsupported Encoding ${encoding}`);
    }
    if (chunk) {
      this.hash.update(chunk);
      this.push(chunk);
    }
    callback();
  }

  digest(encoding: BinaryToTextEncoding = 'base64url') {
    return this.hash.digest(encoding);
  }
}

class Crc32 extends Transform {
  private checksum?: number;
  constructor() {
    super();
    this.checksum = undefined;
  }

  _transform(chunk: Buffer, encoding: string, callback: () => void) {
    if (encoding !== 'buffer') {
      throw new Error(`Unsupported Encoding ${encoding}`);
    }
    if (chunk) {
      this.checksum = crc32(chunk, this.checksum);
      this.push(chunk);
    }
    callback();
  }

  digest() {
    return this.checksum?.toString(16);
  }
}
export default {
  sha256: () => new SHA256Stream(),
  crc32: () => new Crc32(),
};
