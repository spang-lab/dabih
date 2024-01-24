import { readFile } from 'node:fs/promises';
import yaml from 'js-yaml';
import log from './logger.js';

let config = null;

export const getEnv = (key, defaultValue = '') => {
  const { env } = process;
  const value = env[key];
  if (value) {
    return value;
  }
  if (config && config.env && config.env[key]) {
    log.warn(`Reading env var ${key} from config.yaml`);
    return config.env[key];
  }
  log.warn(`Enviroment Variable ${key} not configured, using default '${defaultValue}'`);
  return defaultValue;
};

export const initConfig = async () => {
  const filePath = getEnv('CONFIG', './config.yaml');
  log(`Reading config file from ${filePath}`);

  const txt = await readFile(filePath, 'utf8');
  config = yaml.load(txt);
};

export const mockConfig = (mockConf) => {
  log('Using mock config');
  config = mockConf;
};

export const getConfig = () => {
  if (!config) {
    log.error('Config requested before it was initalized');
  }
  return config;
};
