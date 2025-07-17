import { Transform } from 'node:stream';
import { createHash } from 'node:crypto';
import crc32 from 'crc/calculators/crc32';
class ValidationStream extends Transform {
    hash;
    byteCount;
    constructor() {
        super({});
        this.hash = createHash('sha256');
        this.byteCount = 0;
    }
    _transform(chunk, encoding, callback) {
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
    checksum;
    constructor() {
        super();
        this.checksum = undefined;
    }
    _transform(chunk, encoding, callback) {
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
//# sourceMappingURL=stream.js.map