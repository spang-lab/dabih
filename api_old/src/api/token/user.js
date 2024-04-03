const route = async (ctx) => {
  if (!ctx.data || !ctx.data.sub) {
    ctx.body = null;
    return;
  }
  const { sub, scopes, isAdmin } = ctx.data;
  ctx.body = {
    sub,
    scopes,
    isAdmin,
  };
};

export default route;
