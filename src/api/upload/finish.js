import { sha256 } from '../../crypto/index.js';
import { dataset } from '../../database/index.js';
import { sendError } from '../../util/index.js';

const areChunksComplete = (chunks) => {
  const n = chunks.length;
  let prevEnd = 0;
  for (let i = 0; i < n; i += 1) {
    const chunk = chunks[i];
    if (chunk.start !== prevEnd) {
      return false;
    }
    prevEnd = chunk.end;
    if (i === n - 1) {
      return chunk.end === chunk.size;
    }
  }
  return false;
};

const route = async (ctx) => {
  const { mnemonic } = ctx.params;

  const chunks = await dataset.listChunks(ctx, mnemonic);

  if (!areChunksComplete(chunks)) {
    sendError(ctx, 'Uploaded chunks are incomplete');
    return;
  }

  const { size } = chunks[0];
  const fullHash = sha256.hashChunks(chunks);

  await dataset.update(ctx, mnemonic, {
    hash: fullHash,
    size,
  });

  ctx.body = { hash: fullHash };
};
export default route;
