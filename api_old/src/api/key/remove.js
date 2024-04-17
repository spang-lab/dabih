import { publicKey, dataset } from '../../database/index.js';

const route = async (ctx) => {
  const { sub, isAdmin } = ctx.data;
  const { keyId } = ctx.request.body;
  if (!keyId) {
    ctx.error('No key id', 400);
    return;
  }
  const key = await publicKey.find(ctx, {
    id: keyId,
  });

  if (sub !== key.sub && !isAdmin) {
    ctx.error('Not your key');
    return;
  }

  if (key.isRootKey) {
    await publicKey.remove(ctx, keyId);
    const datasets = await dataset.listAll(ctx);
    const promises = datasets.map(async (dset) => {
      const { mnemonic } = dset;
      await dataset.dropKeys(ctx, mnemonic);
    });
    await Promise.all(promises);
  } else {
    const datasets = await dataset.listAccessible(ctx, key.sub);
    const promises = datasets.map(async (dset) => {
      const { mnemonic } = dset;
      await dataset.setMemberAccess(ctx, mnemonic, key.sub, 'none');
      await dataset.dropKeys(ctx, mnemonic);
    });
    await Promise.all(promises);
    await publicKey.remove(ctx, keyId);
  }

  ctx.body = 'ok';
};
export default route;