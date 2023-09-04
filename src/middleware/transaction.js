import { getSql } from '../database/index.js';

export default async (ctx, next) => {
  const sql = getSql();
  console.log(sql.options.dialect);
  ctx.state.sql = sql;
  const { method } = ctx.request;
  if (method === 'GET') {
    // no transaction needed
    await next();
    return;
  }
  await sql.transaction(async () => {
    await next();
  });
};
