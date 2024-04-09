import { getEnv } from "#lib/env";
import winston from "winston";

const { combine, timestamp, json, cli } = winston.format;

const logger = winston.createLogger();
const level = getEnv('LOG_LEVEL', 'info');

if (getEnv('NODE_ENV', 'development') === 'production') {
  logger.add(new winston.transports.Console({
    level,
    format: combine(timestamp(), json()),
  }));
} else {
  logger.add(new winston.transports.Console({
    level,
    format: cli({ levels: logger.levels }),
  }));
  logger.warn('Server is running in development mode');
  logger.info(`Log level is ${level}`);
}


export default logger;
