import jwt from 'jsonwebtoken';
import createClient from 'openapi-fetch'
import { requireEnv } from './env';

import type { paths } from 'build/api';


const port = requireEnv("PORT");
const host = `http://localhost:${port}`;
const baseUrl = `${host}/api/v1`;
const tokenSecret = requireEnv("TOKEN_SECRET");

const admin = {
  sub: "admin",
  scope: "upload key dataset token admin",
  aud: host,
};
const token = jwt.sign(admin, tokenSecret);

const client = createClient<paths>({
  baseUrl,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

export default client;
