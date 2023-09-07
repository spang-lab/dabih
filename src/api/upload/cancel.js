import { dataset } from '../../database/index.js';
import { getStorage } from '../../storage/index.js';

const route = async (ctx) => {
  const storage = getStorage();
  const { mnemonic } = ctx.params;
  await dataset.destroy(ctx, mnemonic);
  await storage.destroyDataset(mnemonic);

  ctx.body = 'ok';
};
export default route;
