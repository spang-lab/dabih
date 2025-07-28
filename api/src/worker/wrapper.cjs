require('tsx/cjs');
const { workerData } = require('worker_threads');

module.exports = require(workerData.path);
