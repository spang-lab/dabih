export function getModel(ctx, modelName) {
  return ctx.state.sql.model(modelName);
}
export function getTx(ctx) {
  return ctx.state.tx;
}
