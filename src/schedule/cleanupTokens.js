import { token, getSql } from '../database/index.js';

const job = async () => {
  const sql = getSql();
  await sql.transaction(async (tx) => {
    const ctx = {
      state: {
        sql,
        tx,
      },
    };
    await token.cleanup(ctx);
  });
};

export default job;
