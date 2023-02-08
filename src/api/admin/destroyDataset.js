import { dataset } from '../../database/index.js';
import { sendError } from '../../util/index.js';
import { getStorage } from '../../storage/index.js';

const route = async (ctx) => {
  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    sendError(ctx, 'No mnemonic', 400);
    return;
  }
  await dataset.destroy(ctx, mnemonic);

  const storage = getStorage();
  await storage.destroyDataset(mnemonic);

  ctx.body = 'ok';
};
export default route;
