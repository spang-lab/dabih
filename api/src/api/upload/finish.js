import { sha256 } from '../../crypto/index.js';
import { dataset } from '../../database/index.js';
import { getStorage } from '../../storage/init.js';
import { deleteKey } from '../../ephemeral/index.js';

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
  const storage = getStorage();

  const chunks = await dataset.listChunks(ctx, mnemonic);
  const keys = await dataset.listRecoveryKeys(ctx, mnemonic);

  if (!areChunksComplete(chunks)) {
    ctx.error('Uploaded chunks are incomplete');
    return;
  }

  const { size } = chunks[0];
  const fullHash = sha256.hashChunks(chunks);

  await deleteKey(mnemonic);

  await dataset.update(ctx, mnemonic, {
    hash: fullHash,
    size,
  });

  const dset = await dataset.fromMnemonic(ctx, mnemonic);
  const recovery = {
    dataset: {
      ...dset,
      chunks,
    },
    keys,
  };
  await storage.writeRecovery(mnemonic, recovery);

  ctx.body = { hash: fullHash };
};
export default route;
