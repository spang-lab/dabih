/* eslint-disable no-underscore-dangle, no-bitwise */
import { Transform, Writable } from 'node:stream';
import crc32 from 'crc-32';

class Crc32 extends Transform {
  constructor(options) {
    super(options);
    this.checksum = null;
  }

  _transform(chunk, encoding, callback) {
    if (encoding !== 'buffer') {
      throw new Error(`Unsupported Encoding ${encoding}`);
    }
    if (chunk) {
      if (this.checksum !== null) {
        this.checksum = crc32.buf(chunk, this.checksum >>> 0);
      } else {
        this.checksum = crc32.buf(chunk);
      }
      this.push(chunk, encoding);
    }
    callback();
  }

  digest(encoding) {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32BE(this.checksum >>> 0);
    return buffer.toString(encoding);
  }
}

const checksum = async (file, encoding = 'hex') => {
  const stream = file.createReadStream();
  const devNull = new Writable();
  devNull._write = (_chunk, _enc, callback) => { callback(); };
  const crcStream = new Crc32();
  return new Promise((resolve) => {
    stream.pipe(crcStream).pipe(devNull);
    crcStream.on('finish', () => resolve(crcStream.digest(encoding)));
  });
};

export default {
  createStream: () => new Crc32(),
  checksum,
};
