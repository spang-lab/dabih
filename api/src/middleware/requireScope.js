export default (scope) => async (ctx, next) => {
  if (!ctx.data) {
    throw new Error('ctx.data is not initialized');
  }
  const { scopes } = ctx.data;

  if (!scopes.includes(scope)) {
    ctx.error(`User has scopes [${scopes.join(', ')}],
      required is: ${scope}`, 401);
    return;
  }

  await next();
};
