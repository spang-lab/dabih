/* eslint-disable @typescript-eslint/no-unsafe-argument */
import jwt from 'jsonwebtoken';
import createClient from 'openapi-fetch'
import { getEnv, requireEnv } from './env';

import type { components, paths } from 'build/api';

type schemas = components["schemas"];


interface Chunk {
  mnemonic: string;
  start: number;
  end: number;
  size: number;
  hash: string;
  data: Blob;
}

const init = (port?: number) => {
  const lPort = port?.toString() ?? getEnv('PORT', '3001');

  const host = `http://localhost:${lPort}`;
  const baseUrl = `${host}/api/v1`;
  const tokenSecret = requireEnv("TOKEN_SECRET");

  const admin = {
    sub: "admin",
    scope: "upload user dataset token admin",
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
    remove: (id: number) => c.POST('/token/remove', { body: { tokenId: id } }),
    list: () => c.GET('/token/list'),
  }
  const user = {
    add: (body: schemas["UserAddBody"]) => c.POST('/user/add', { body }),
    me: () => c.GET('/user/me'),
    find: (sub: string) => c.POST('/user/find', { body: { sub } }),
    list: () => c.GET('/user/list'),
    remove: (sub: string) => c.POST('/user/remove', { body: { sub } }),
    addKey: (body: schemas["KeyAddBody"]) => c.POST('/user/key/add', { body }),
    enableKey: (body: schemas["KeyEnableBody"]) => c.POST('/user/key/enable', { body }),
    removeKey: (body: schemas["KeyRemoveBody"]) => c.POST('/user/key/remove', { body }),
  }
  const upload = {
    start: (body: schemas["UploadStartBody"]) => c.POST('/upload/start', { body }),
    chunk: (ck: Chunk) => {
      return c.PUT('/upload/{mnemonic}/chunk', {
        params: {
          path: { mnemonic: ck.mnemonic },
          header: {
            'content-range': `bytes ${ck.start}-${ck.end}/${ck.size}`,
            digest: `sha-256=${ck.hash}`
          }
        },
        body: {
          chunk: ck.data,
        },
        bodySerializer: (body) => {
          const fd = new FormData();
          for (const key in body) {
            // @ts-expect-error this is ok 
            fd.append(key, body[key]);
          }
          return fd;
        },

      });
    },
    cancel: (mnemonic: string) => c.POST('/upload/{mnemonic}/cancel', { params: { path: { mnemonic } } }),
    finish: (mnemonic: string) => c.POST('/upload/{mnemonic}/finish', { params: { path: { mnemonic } } }),
  }



  const client = {
    ...c,
    token,
    user,
    upload,
  }

  return client;



}


export default init;
