import jwt from 'jsonwebtoken';
import createClient from 'openapi-fetch'
import { getEnv, requireEnv } from './env';

import type { components, paths } from 'build/api';

type schemas = components["schemas"];

const init = (port?: number) => {
  const lPort = port?.toString() ?? getEnv('PORT', '3001');

  const host = `http://localhost:${lPort}`;
  const baseUrl = `${host}/api/v1`;
  const tokenSecret = requireEnv("TOKEN_SECRET");

  const admin = {
    sub: "admin",
    scope: "upload key dataset token admin",
    aud: host,
  };
  const apiToken = jwt.sign(admin, tokenSecret);
  const c = createClient<paths>({
    baseUrl,
    headers: {
      'Authorization': `Bearer ${apiToken}`
    }
  });


  const token = {
    info: () => c.GET('/token/info'),
    add: (body: schemas["TokenAddBody"]) => c.POST('/token/add', { body }),
    remove: (id: number) => c.POST('/token/{tokenId}/remove', { params: { path: { tokenId: id } } }),
    list: () => c.GET('/token/list'),
  }

  const key = {
    add: (body: schemas["KeyAddBody"]) => c.POST('/key/add', { body }),
    remove: (id: number) => c.POST('/key/{keyId}/remove', { params: { path: { keyId: id } } }),
  }


  const client = {
    ...c,
    token,
    key,
  }

  return client;



}


export default init;
