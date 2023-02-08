import pLimit from 'p-limit';
import { literal } from 'sequelize';
import { getSql, dataset } from '../database/index.js';
import { log } from '../util/index.js';
import { getStorage } from '../storage/index.js';
import { crc } from '../crypto/index.js';

const checkChunk = async (mnemonic, chunk) => {
  const storage = getStorage();
  const file = await storage.open(mnemonic, chunk.hash);
  const crc32 = await crc.checksum(file);
  await storage.close(file);
  if (crc32 !== chunk.crc) {
    log.error('------- CRITICAL ERROR --------');
    log.error(`Chunk ${chunk.hash} of dataset ${mnemonic} has an invalid checksum.`);
    log.error(`Expected: ${chunk.crc} Got: ${crc32}`);
    log.error('------- CRITICAL ERROR --------');
    return false;
  }
  return true;
};

const checkDatasets = async (ctx) => {
  const datasets = await dataset.listAll(ctx);

  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const tenDays = oneDay * 10;

  const vDataset = datasets.find((dset) => dset.hash && now - new Date(dset.validated) > tenDays);
  if (!vDataset) {
    return;
  }
  const { mnemonic } = vDataset;
  log(`Checking dataset integrity for ${mnemonic}`);
  const chunks = await dataset.listChunks(ctx, mnemonic);
  const limit = pLimit(3);
  const promises = chunks.map((c) => limit(() => checkChunk(mnemonic, c)));
  const results = await Promise.all(promises);
  const valid = results.every((r) => r);
  if (valid) {
    log(`${mnemonic} with ${chunks.length} chunks ok.`);
    await dataset.update(ctx, mnemonic, {
      validated: literal('CURRENT_TIMESTAMP'),
    });
  } else {
    log.error(`${mnemonic} invalid`);
  }
};

const job = async () => {
  const sql = getSql();
  await sql.transaction(async (tx) => {
    const ctx = {
      state: {
        sql,
        tx,
      },
    };
    await checkDatasets(ctx);
  });
};

export default job;
