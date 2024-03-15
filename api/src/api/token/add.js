import { token } from '../../database/index.js';

const route = async (ctx) => {
  const { body } = ctx.request;
  const {
    scopes,
    lifetime,
  } = body;

  if (!scopes || !scopes.length) {
    ctx.error(
      'No scopes requested in body.scopes',
      400,
    );
    return;
  }
  const result = await token.generate(
    ctx,
    scopes,
    lifetime,
  );
  ctx.body = result;
};
export default route;
