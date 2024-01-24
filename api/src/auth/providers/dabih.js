import { token } from '../../database/index.js';

const isExpired = (user) => {
  const { timestamp, lifetime } = user;
  const now = new Date();
  const ts = +new Date(timestamp); // + converts to ms
  const exp = new Date(ts + lifetime);
  return exp < now;
};

export default async function dabihProvider(ctx, accessToken) {
  const user = await token.find(ctx, { token: accessToken });
  if (!user) {
    throw new Error(`Invalid token ${accessToken}`);
  }
  if (isExpired(user)) {
    throw new Error(
      `Token ${accessToken} is expired, sign in to the web app to refresh the token`,
    );
  }
  return {
    sub: user.sub,
    name: user.name,
    email: user.email,
    scopes: user.scopes,
  };
}
