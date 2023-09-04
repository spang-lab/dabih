/* eslint-disable import/prefer-default-export */

export function getModel(ctx, modelName) {
  return ctx.state.sql.model(modelName);
}

export function getDialect(ctx) {
  return ctx.state.sql.options.dialect;
}
