/* eslint-disable no-underscore-dangle, no-bitwise */
import { Transform } from 'node:stream';

import {
  createHash,
  BinaryToTextEncoding,
  Hash
} from 'node:crypto';



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

export default {
  createStream: () => new SHA256Stream(),
};
