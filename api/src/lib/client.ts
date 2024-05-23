/* eslint-disable @typescript-eslint/no-unsafe-argument */
import jwt from 'jsonwebtoken';
import createClient from 'openapi-fetch'
import { getEnv, requireEnv } from './env';

import type { components, paths } from 'build/api';
import { createHash } from 'crypto';

type schemas = components["schemas"];


interface Chunk {
  mnemonic: string;
  start: number;
  end: number;
  size: number;
  hash: string;
  data: Blob;
}

const init = (port?: number, sub?: string) => {
  const lPort = port?.toString() ?? getEnv('PORT', '3001');

  const host = `http://localhost:${lPort}`;
  const baseUrl = `${host}/api/v1`;
  const tokenSecret = requireEnv("TOKEN_SECRET");

  const admin = {
    sub: sub ?? "admin",
    scope: "upload download user dataset token admin",
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

  const dataset = {
    get: (mnemonic: string) => c.GET('/dataset/{mnemonic}', { params: { path: { mnemonic } } }),
    search: (body: schemas["SearchRequestBody"]) => c.POST('/dataset/search', { body }),
    rename: (mnemonic: string, name: string) => c.POST('/dataset/{mnemonic}/rename', { params: { path: { mnemonic } }, body: { name } }),
    remove: (mnemonic: string) => c.POST('/dataset/{mnemonic}/remove', { params: { path: { mnemonic } } }),
    restore: (mnemonic: string) => c.POST('/dataset/{mnemonic}/restore', { params: { path: { mnemonic } } }),
    destroy: (mnemonic: string, force?: boolean) => c.POST('/dataset/{mnemonic}/destroy', { params: { path: { mnemonic } }, body: { force: force ?? false } }),
    addMember: (mnemonic: string, body: schemas["MemberAddBody"]) => c.POST('/dataset/{mnemonic}/addMember', { params: { path: { mnemonic } }, body }),
    setAccess: (mnemonic: string, body: schemas["SetAccessBody"]) => c.POST('/dataset/{mnemonic}/setAccess', { params: { path: { mnemonic } }, body }),
  }

  const download = {
    decrypt: (mnemonic: string, key: string) => c.POST('/download/{mnemonic}/decrypt', { params: { path: { mnemonic } }, body: { key } }),
    mnemonic: (mnemonic: string) => c.GET('/download/{mnemonic}', { params: { path: { mnemonic } } }),
    chunk: (mnemonic: string, hash: string) => c.GET('/download/{mnemonic}/chunk/{hash}', { params: { path: { mnemonic, hash } } }),
  };


  const uploadBlob = async (fileName: string, data: Blob) => {
    const { data: dataset, response, error } = await upload.start({ fileName });
    if (error) {
      return { response, error };
    }
    if (!dataset) {
      return { response, error: { message: "No dataset" } };
    }
    const { mnemonic } = dataset;
    const hash = createHash('sha256');
    const buffer = Buffer.from(await data.arrayBuffer());
    hash.update(buffer);

    const chunk = {
      mnemonic,
      start: 0,
      end: data.size - 1,
      size: data.size,
      hash: hash.digest('base64url'),
      data,
    }
    const { response: response2, error: error2 } = await upload.chunk(chunk);
    if (error2) {
      return { response: response2, error: error2 };
    }
    const { response: response3, error: error3, data: result } = await upload.finish(mnemonic);
    if (error3) {
      return { response: response3, error: error3 };
    }
    return {
      data: result,
    }
  }


  const client = {
    ...c,
    token,
    user,
    upload,
    download,
    dataset,
    uploadBlob,
  }

  return client;



}


export default init;
