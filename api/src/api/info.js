import packageInfo from '../../package.json' assert { type: "json" };
import { readConfig } from '../util/index.js';

const route = async (ctx) => {
  const config = await readConfig();
  config.version = packageInfo.version;
  ctx.body = config;
};

export default route;
