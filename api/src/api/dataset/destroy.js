import { dataset } from '../../database/index.js';
import { getSub, userHasScope } from '../../util/index.js';
import { getStorage } from '../../storage/index.js';

const timeSince = (date) => {
  const now = new Date();
  const diff = now - date;
  const oneMinute = 1000 * 60;
  const oneHour = 60 * oneMinute;
  const oneDay = 24 * oneHour;

  const getValue = (v, unit) => {
    const rounded = Math.floor(v);
    if (rounded === 1) {
      return `${rounded} ${unit} ago`;
    }
    return `${rounded} ${unit}s ago`;
  };

  if (diff < oneHour) {
    return getValue(diff / oneMinute, 'minute');
  }
  if (diff < oneDay) {
    return getValue(diff / oneHour, 'hour');
  }
  return getValue(diff / oneDay, 'day');
};

const isAllowed = async (ctx, mnemonic) => {
  if (userHasScope(ctx, 'admin')) {
    return true;
  }
  const sub = getSub(ctx);
  const permission = await dataset.getMemberAccess(ctx, mnemonic, sub);
  return permission === 'write';
};

const checkDeleted = async (ctx, mnemonic) => {
  if (userHasScope(ctx, 'admin')) {
    return null;
  }
  const { deletedAt } = await dataset.fromMnemonic(ctx, mnemonic);
  if (!deletedAt) {
    return 'Dataset needs to be removed first';
  }
  const diffMs = new Date() - new Date(deletedAt);
  const oneDay = 24 * 60 * 60 * 1000;
  if (diffMs < oneDay) {
    return `Can only destroy a dataset 24 hours after deletion. Currently: ${timeSince(deletedAt)}`;
  }
  return null;
};

const route = async (ctx) => {
  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    ctx.error('No mnemonic', 400);
    return;
  }
  if (!await isAllowed(ctx, mnemonic)) {
    ctx.error('You do not have permission to destroy the dataset', 400);
    return;
  }
  const error = await checkDeleted(ctx, mnemonic);
  if (error) {
    ctx.error(`Cannot destroy dataset. ${error}`, 400);
    return;
  }

  await dataset.destroy(ctx, mnemonic);
  const storage = getStorage();
  await storage.destroyDataset(mnemonic);

  ctx.body = 'ok';
};
export default route;
