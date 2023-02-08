import { publicKey, getSql } from '../database/index.js';
import { getConfig, log } from '../util/index.js';
import { rsa } from '../crypto/index.js';

const checkRootKeys = async (ctx) => {
  const { crypto } = getConfig();
  const { rootKeys } = crypto;

  if (rootKeys.length === 0) {
    log.warn('+++ NO ROOT KEYS CONFIGURED +++');
    log.warn('Datasets will NOT be recoverable in case of key loss by it\'s owners');
    log.warn('Use the script in "scripts/" to generate one and set "crypto.rootKeys" in the config');
  }

  const keys = rootKeys.map((key) => ({
    data: key,
    name: 'ROOT_KEY',
    sub: '__dabih__',
    isRootKey: true,
    hash: rsa.hashKey(key),
  }));

  const dbKeys = await publicKey.list(ctx, {
    isRootKey: true,
  });
  const missing = keys.filter((key) => !dbKeys.find((dbKey) => key.hash === dbKey.hash));
  const surplus = dbKeys.filter((dbKey) => !keys.find((key) => key.hash === dbKey.hash));

  const promises = missing.map(async (newKey) => {
    log(`Adding new root key with digest ${newKey.hash}`);
    await publicKey.add(ctx, newKey);
  });
  await Promise.all(promises);
  const dPromises = surplus.map(async (dbKey) => {
    log(`Removing surplus key with digest ${dbKey.hash}`);
    await publicKey.remove(ctx, dbKey.id);
  });
  await Promise.all(dPromises);
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
    await checkRootKeys(ctx);
  });
};

export default job;
