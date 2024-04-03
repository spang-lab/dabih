import { readFile } from 'node:fs/promises';
import yaml from 'js-yaml';

export const parseUrl = (url) => {
  if (!url.includes(':')) {
    throw new Error(`Could not parse url ${url},
      needs to be of the form "<backend>:<path>"`);
  }
  const [backend, path] = url.split(':', 2);
  return { backend, path };
};

const isFalsey = (str) => {
  const lower = str.trim().toLowerCase();
  if (lower === 'false' || lower === '0' || lower === '') {
    return true;
  }
  return false;
};

export const getEnv = (key, defaultValue = '') => {
  const { env } = process;
  const value = env[key];
  if (value) {
    if (isFalsey(value)) {
      return false;
    }
    return value;
  }
  return defaultValue;
};
export const requireEnv = (key) => {
  const { env } = process;
  const value = env[key];
  if (value) {
    return value;
  }
  throw new Error(`ENV var "${key}" is required, but was not found.`);
};

export const readConfig = async () => {
  const path = requireEnv('CONFIG');
  const content = await readFile(path, 'utf8');
  const config = yaml.load(content);
  return config;
};
