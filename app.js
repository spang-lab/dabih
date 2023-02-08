/* eslint-disable no-console */
import server from './src/server.js';

(async () => {
  try {
    await server();
  } catch (err) {
    console.error('ERROR RUNNING SERVER');
    console.error(err);
    process.exit(1);
  }
})();
