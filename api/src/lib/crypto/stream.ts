import { Transform } from 'node:stream';

import { createHash, Hash } from 'node:crypto';
import crc32 from 'crc/calculators/crc32';

class ValidationStream extends Transform {
  private hash: Hash;
  private byteCount: number;

  constructor() {
    super({});
    this.hash = createHash('sha256');
    this.byteCount = 0;
  }

  _transform(chunk: Buffer, encoding: string, callback: () => void) {
    if (encoding !== 'buffer') {
      throw new Error(`Unsupported Encoding ${encoding}`);
    }
    if (chunk) {
      this.byteCount += chunk.length;
      this.hash.update(chunk);
      this.push(chunk);
    }
    callback();
  }

  digest() {
    return {
      hash: this.hash.digest('base64url'),
      byteCount: this.byteCount,
    };
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
    if (!this.checksum) {
      throw new Error('No data to checksum');
    }
    return this.checksum.toString(16);
  }
}
export default {
  validate: () => new ValidationStream(),
  crc32: () => new Crc32(),
};
