import createClient from "openapi-fetch";

import type { components, paths } from './schema';
type schemas = components["schemas"];

interface Chunk {
  mnemonic: string;
  start: number;
  end: number;
  size: number;
  hash: string;
  data: Blob;
}

const init = (baseUrl: string) => {
  const c = createClient<paths>({
    baseUrl,
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
          if (body?.chunk) {
            fd.append('chunk', body.chunk);
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
    get: (token: string) => c.GET('/download', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      parseAs: 'stream',
    }),
    chunk: (mnemonic: string, hash: string) => c.GET('/download/{mnemonic}/chunk/{hash}', {
      parseAs: 'stream',
      params: { path: { mnemonic, hash } }
    }),
  };
  const util = {
    healthy: () => c.GET('/healthy'),
    info: () => c.GET('/info'),
  };



  return {
    client: c,
    token,
    user,
    upload,
    dataset,
    download,
    util,
  };
};
export default init;
