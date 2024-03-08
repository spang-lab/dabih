import { dataset, getSql } from '../database/index.js';
import { getStorage } from '../storage/index.js';
import { isExpired, deleteKey } from '../ephemeral/index.js';

const cleanup = async (ctx) => {
  const storage = getStorage();
  const incompleteUploads = await dataset.listIncomplete(ctx);

  const promises = incompleteUploads.map(async (dset) => {
    const { mnemonic } = dset;
    if (!await isExpired(mnemonic)) {
      return;
    }
    await deleteKey(mnemonic);
    await dataset.destroy(ctx, mnemonic);
    await storage.destroyDataset(mnemonic);
  });
  await Promise.all(promises);
};

const job = async () => {
  const sql = getSql();
  await sql.transaction(async (tx) => {
    const ctx = {
      state: {
        sql,
        tx,
      },
    };
    await cleanup(ctx);
  });
};

export default job;
