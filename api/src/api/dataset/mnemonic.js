import { dataset } from '../../database/index.js';

const route = async (ctx) => {
  const { mnemonic } = ctx.params;

  const info = await dataset.fromMnemonic(ctx, mnemonic);
  const chunks = await dataset.listChunks(ctx, mnemonic);

  ctx.body = {
    ...info,
    chunks,
  };
};
export default route;
