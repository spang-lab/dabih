/* eslint-disable no-restricted-syntax, no-await-in-loop */
import { Sequelize } from 'sequelize';
import { createNamespace } from 'cls-hooked';
import { log, getConfig, getEnv } from '../util/index.js';

import {
  initChunk,
  initDataset,
  initEvent,
  initKey,
  initMember,
  initPublicKey,
  initToken,
} from './model/index.js';

let sequelize = null;

const namespace = createNamespace('transactions');
Sequelize.useCLS(namespace);

const isReady = async () => {
  if (!sequelize) {
    return false;
  }
  try {
    await sequelize.authenticate();
    return true;
  } catch (err) {
    log.error(err);
    return false;
  }
};

const delay = (ms = 1000) => new Promise((r) => { setTimeout(r, ms); });

const waitForDatabase = async () => {
  const maxTries = 10;
  const threeSeconds = 3000;
  for (let t = 1; t <= maxTries; t += 1) {
    if (await isReady()) {
      log('Database ready');
      return true;
    }
    await delay(threeSeconds);
    log(`(${t}/${maxTries}) Waiting for database connection`);
  }
  return false;
};

const connect = async () => {
  const { database } = getConfig();

  const { dialect, logging } = database;

  const config = {
    ...database,
  };
  if (logging) {
    config.logging = (msg) => log.verbose(msg);
  }

  switch (dialect.toLowerCase()) {
    case 'sqlite':
      sequelize = new Sequelize(config);
      break;
    case 'postgres':
      sequelize = new Sequelize({
        ...config,
        password: getEnv('DATABASE_SECRET', ''),
      });
      break;
    default:
      throw new Error(`Unknown database dialect ${dialect}, [sqlite, postgres] are supported`);
  }

  const isOk = await waitForDatabase();
  if (!isOk) {
    log.error('Database connection failed, check config.postgres settings');
    throw new Error('Database connection failed');
  }
};

export const initDb = async () => {
  await connect();
  const PublicKey = await initPublicKey(sequelize);
  await initToken(sequelize);

  const Dataset = await initDataset(sequelize);
  const Chunk = await initChunk(sequelize);
  Dataset.hasMany(Chunk, { as: 'chunks', foreignKey: 'datasetId' });

  const Member = await initMember(sequelize);
  Dataset.hasMany(Member, { as: 'members', foreignKey: 'datasetId' });

  const Key = await initKey(sequelize);
  Dataset.hasMany(Key, { as: 'keys', foreignKey: 'datasetId' });
  PublicKey.hasMany(Key, { as: 'keys', foreignKey: 'publicKeyId' });

  await initEvent(sequelize);

  await sequelize.sync({ force: false });
};

export const getSql = () => sequelize;
