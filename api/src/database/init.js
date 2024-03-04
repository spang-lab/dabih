/* eslint-disable no-restricted-syntax, no-await-in-loop */
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { createNamespace } from 'cls-hooked';
import {
  log, getEnv, requireEnv,
} from '../util/index.js';

import initModels from './model/index.js';

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

const delay = (ms = 1000) => new Promise((r) => {
  setTimeout(r, ms);
});

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
  const url = requireEnv('DB_URL');
  const debug = getEnv('DB_DEBUG', 'false');

  const config = {
    supportBigNumbers: true,
    bigNumberStrings: true,
    logging: false,
    retry: {
      max: 10,
    },
  };
  if (debug) {
    config.logging = (msg) => log.verbose(msg);
  }
  sequelize = new Sequelize(url, config);
  log.log(`Connecting to: ${url}`);

  const isOk = await waitForDatabase();
  if (!isOk) {
    log.error('Database connection failed, check config.postgres settings');
    throw new Error('Database connection failed');
  }
};

const migrate = async () => {
  const umzug = new Umzug({
    migrations: {
      glob: ['./migrations/*.js', { cwd: import.meta.dirname }],
    },
    context: sequelize,
    storage: new SequelizeStorage({
      sequelize,
    }),
    logger: null,
    logging: false,
  });
  umzug.on('migrating', (e) => log(`Applying database migration ${e.name}`));
  umzug.on('migrated', (e) => log(`Migration ${e.name} complete.`));

  // Reset the database
  await umzug.down({ to: 0 });

  const migrations = await umzug.pending();
  if (migrations.length) {
    log.warn('Database schema needs to be updated.');
  }
  const executed = await umzug.up();
  if (executed.length) {
    log.warn(`Completed ${executed.length} migrations.`);
  }
};

export const initDb = async () => {
  await connect();
  await migrate();

  initModels(sequelize);
};

export const getSql = () => sequelize;
