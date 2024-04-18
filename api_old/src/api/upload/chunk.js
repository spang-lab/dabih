import Busboy from '@fastify/busboy';
import {
  aes, crc, sha256,
} from '../../crypto/index.js';
import { dataset } from '../../database/index.js';
import { readKey } from '../../ephemeral/index.js';
import { getStorage } from '../../storage/index.js';

const readHeaders = (ctx) => {
  const digest = ctx.get('Digest');

  const digestRegex = /^sha-256=[a-zA-Z0-9-_]+={0,2}$/;
  if (!digestRegex.test(digest)) {
    throw new Error(`Invalid digest header ${digest}`);
  }
  const firstEqIdx = digest.indexOf('=');
  const hash = digest.slice(firstEqIdx + 1);
  const contentRange = ctx.get('Content-Range');
  const rangeRegex = /^bytes \d+-\d+\/\d+$/;
  if (!rangeRegex.test(contentRange)) {
    throw new Error(`Invalid Content-Range header ${contentRange}`);
  }
  const [, numbers] = contentRange.split(' ');
  const [range, size] = numbers.split('/');
  const [start, end] = range.split('-');

  return {
    digest,
    hash,
    start: parseInt(start, 10),
    end: parseInt(end, 10),
    size: parseInt(size, 10),
  };
};

const readFile = async (req, encrypt, stream) => new Promise((resolve, reject) => {
  const { headers } = req;
  const crcStream = crc.createStream();
  const hashStream = sha256.createStream();
  const busboy = new Busboy({ headers });
  busboy.on('file', (_field, file) => {
    stream.on('finish', () => resolve({
      crc32: crcStream.digest('hex'),
      hash: hashStream.digest(),
    }));
    file.pipe(hashStream).pipe(encrypt).pipe(crcStream).pipe(stream);
  });
  busboy.on('finish', () => { });
  busboy.on('error', reject);
  req.pipe(busboy);
});

const route = async (ctx) => {
  const { mnemonic } = ctx.params;
  const storage = getStorage();

  const key = await readKey(mnemonic);
  if (!key) {
    ctx.error('Encryption key not found in ephemeral store');
    return;
  }

  const iv = await aes.generateIv();

  let chunk;
  try {
    const {
      hash, start, end, size,
    } = readHeaders(ctx);
    chunk = {
      hash,
      start,
      end,
      size,
      iv,
    };
  } catch (err) {
    ctx.error(err.message);
    return;
  }
  if (await storage.exists(mnemonic, chunk.hash)) {
    const existing = await dataset.findChunk(
      ctx,
      mnemonic,
      chunk.hash,
    );
    if (existing) {
      ctx.body = existing;
      return;
    }
  }

  const targetFile = await storage.create(mnemonic, chunk.hash);
  const stream = targetFile.createWriteStream();
  const encrypt = aes.encryptStream(key, iv);
  const { hash, crc32 } = await readFile(ctx.req, encrypt, stream);
  await storage.close(targetFile);

  if (hash !== chunk.hash) {
    ctx.error(`Invalid chunk, hash mismatch ${chunk.hash} != ${hash}`);
    return;
  }
  chunk.crc = crc32;
  await dataset.addChunk(ctx, mnemonic, chunk);

  ctx.body = chunk;
};
export default route;
