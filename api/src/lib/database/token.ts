import { TokenResponse } from 'src/api/types';
import { Token } from '@prisma/client';
import random from '#lib/crypto/random';
import db from '#lib/db';

const TOKEN_PREFIX = 'dabih_at_';

export const isToken = (token: string) => token.startsWith(TOKEN_PREFIX);

export const generateValue = async () => {
  const token = await random.getToken(32);
  return `${TOKEN_PREFIX}${token}`;
};

const getExpired = (exp: Date | null) => {
  if (!exp) {
    return false;
  }
  const now = new Date();
  const diff = now.getTime() - exp.getTime();
  if (diff < 0) {
    return false;
  }

  const oneMinute = 1000 * 60;
  const oneHour = 60 * oneMinute;
  const oneDay = 24 * oneHour;

  if (diff < oneHour) {
    const minutes = Math.round(diff / oneMinute);
    return `${minutes} minute(s) ago`;
  }
  if (diff < oneDay) {
    const hours = Math.round(diff / oneHour);
    return `${hours} hour(s) ago`;
  }
  const days = Math.round(diff / oneDay);
  return `${days} day(s) ago`;
};

export const convertToken = (token: Token, censor: boolean): TokenResponse => {
  const { exp, scope } = token;

  let value = token.value;
  if (censor) {
    const n = value.length;
    value = [...value]
      .map((c, i) => {
        if (i < 14 || i > n - 4) {
          return c;
        }
        return '■';
      })
      .join('');
  }
  return {
    ...token,
    value,
    scopes: scope.split(' '),
    expired: getExpired(exp),
  };
};
