import { Transform } from 'node:stream';
import crc32 from 'crc/calculators/crc32';


class Crc32 extends Transform {
  private checksum: number;
  constructor() {
    super();
    this.checksum = 0;
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
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32BE(this.checksum >>> 0);
    return buffer.toString('hex');
  }
}

export default {
  createStream: () => new Crc32(),
};
