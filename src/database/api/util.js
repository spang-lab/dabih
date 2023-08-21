/* eslint-disable import/prefer-default-export */

export function getModel(ctx, modelName) {
  return ctx.state.sql.model(modelName);
}
