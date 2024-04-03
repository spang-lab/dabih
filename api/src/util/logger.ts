import { getEnv } from "#env";
import winston from "winston";

const logger = winston.createLogger();
const { combine, timestamp, json, cli } = winston.format;

if (getEnv('NODE_ENV', 'development') === 'production') {
  logger.add(new winston.transports.Console({
    level: getEnv('LOG_LEVEL', 'info'),
    format: combine(timestamp(), json()),
  }));
} else {
  logger.add(new winston.transports.Console({
    level: getEnv('LOG_LEVEL', 'info'),
    format: cli(),
  }));
}


export default logger;
