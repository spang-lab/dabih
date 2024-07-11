import { scheduleJob } from 'node-schedule'
import logger from './logger'

const everyFiveMinutes = '*/5 * * * *'

export function initSchedule() {
  logger.info('Starting schedules.')

  const job = async () => {
    logger.info('Running jobs.')
  }
  job().catch((err) => logger.error(err))
  scheduleJob(everyFiveMinutes, job)
}
