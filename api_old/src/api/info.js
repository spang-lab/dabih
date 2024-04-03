/* eslint-disable */
import { readConfig } from '../util/index.js';
import { readFile } from 'node:fs/promises';

const route = async (ctx) => {
  const packageJson = await readFile('package.json');
  const packageInfo = JSON.parse(packageJson);

  const config = await readConfig();
  config.version = packageInfo.version;
  ctx.body = config;
};

export default route;
