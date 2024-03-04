import { getStorage } from '../../storage/index.js';

import { base64UrlToBase64 } from '../../crypto/index.js';

const route = async (ctx) => {
  const { mnemonic, chunkHash } = ctx.params;
  if (!mnemonic || !chunkHash) {
    ctx.error('No mnemonic or no chunkHash', 400);
    return;
  }
  const hash = base64UrlToBase64(chunkHash);
  const storage = getStorage();
  const file = await storage.open(mnemonic, hash);
  const stream = file.createReadStream();

  ctx.set('Content-Type', 'application/octet-stream');
  ctx.body = stream;
};
export default route;
