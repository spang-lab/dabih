import { readFile } from 'node:fs/promises';
import yaml from 'js-yaml';
import log from './logger.js';

let config = null;

export const getEnv = (key, defaultValue = '') => {
  const { env } = process;
  const value = env[key];
  if (!value) {
    log.warn(`Enviroment Variable ${key} not configured, using default '${defaultValue}'`);
    return defaultValue;
  }
  return value;
};

const getUrl = () => {
  const httpDefaultPort = 80;
  const httpsDefaultPort = 443;
  const { server } = config;
  const { protocol, host, port } = server;

  const url = `${protocol}://${host}`;
  if (protocol === 'http' && port === httpDefaultPort) {
    return url;
  }
  if (protocol === 'https' && port === httpsDefaultPort) {
    return `${url}/`;
  }
  return `${url}:${port}/`;
};

export const initConfig = async () => {
  const filePath = getEnv('CONFIG', './config.yaml');
  log(`Reading config file from ${filePath}`);

  const txt = await readFile(filePath, 'utf8');
  config = yaml.load(txt);
  config.server.url = getUrl(config);
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
