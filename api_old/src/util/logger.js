/**
 * Termial color codes
 */
const COLOR = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
};

const logColor = (text, color) => {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const rText = text.replace(/\n/g, '').replace(/\s+/g, ' ');
  const arr = [COLOR.CYAN, time, color, ' > ', rText, COLOR.RESET, '\n'];
  process.stdout.write(arr.join(''));
};

const log = (...arr) => logColor(arr.join(' '), COLOR.RESET);
log.raw = (v) => process.stdout.write(`\n${v}`);
log.log = log;
log.info = log;
log.blue = (...arr) => logColor(`${arr.join(' ')}`, COLOR.BLUE);
log.warn = (...arr) => logColor(`Warning: ${arr.join(' ')}`, COLOR.YELLOW);
log.error = (...arr) => logColor(`Error: ${arr.join(' ')}`, COLOR.RED);
log.verbose = (...arr) => logColor(arr.join(' '), COLOR.MAGENTA);
log.dbg = (...args) => {
  log(COLOR.MAGENTA, '+---------- DEBUG ---------+', COLOR.RESET);
  const string = args.map((arg) => JSON.stringify(arg, null, 2)).join('\n');
  process.stdout.write(`\n${string}`);
};

global.dbg = log.dbg;
export default log;
