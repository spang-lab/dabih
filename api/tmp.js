import { createDecipheriv } from 'crypto';
import { Buffer } from 'buffer';

let aesKey = 'veCam_cNgdvIYHMAICDavTczZm-TaVHD8to7f3P3nmk';
let iv = 'BTNBGixoM7W6W_528ugEvA';
let encrypted =
  'JEpfqrPAwtTuSYiOC3IK0ZHlPubLNSTOdLWhCY8kNTnasi7ys-fl_IuJ27f4hAP7';

const toUint8 = (base64url) => Buffer.from(base64url, 'base64url');

const rawKey = toUint8(aesKey);
const rawIv = toUint8(iv);
const algorithm = 'aes-256-cbc';
const decipher = createDecipheriv(algorithm, rawKey, rawIv);

const decrypted = decipher.update(encrypted, 'base64url', 'utf8');
const result = decrypted + decipher.final('utf8');

console.log(result);
