import { dataset, token } from '../../database/index.js';
import { sha256, base64ToUint8 } from '../../crypto/index.js';
import { aesKey } from '../../ephemeral/index.js';

const route = async (ctx) => {
  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    ctx.error('No mnemonic', 400);
    return;
  }
  const { key } = ctx.request.body;

  const info = await dataset.fromMnemonic(ctx, mnemonic);
  const decoded = base64ToUint8(key);
  const keyHash = sha256.hash(decoded);
  if (info.keyHash !== keyHash) {
    ctx.error('Invalid AES Key', 400);
    return;
  }
  const tenSeconds = 10;
  const secondstoMs = 1000;
  aesKey.store(mnemonic, decoded, tenSeconds);

  const type = 'download';

  const result = await token.generate(ctx, {
    lifetime: tenSeconds * secondstoMs,
    scopes: [type],
    refresh: false,
  });

  ctx.body = result;
};
export default route;
