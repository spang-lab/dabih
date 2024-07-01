import createClient from "openapi-fetch";

import type { components, paths } from './schema';
import mnemonic from "src/api/download/mnemonic";
import addMember from "src/api/dataset/addMember";
import addDirectory from "src/api/fs/addDirectory";
import unfinished from "src/api/upload/unfinished";
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
    unfinished: () => c.GET('/upload/unfinished'),
  }

  const fs = {
    file: (mnemonic: string) => c.GET('/fs/{mnemonic}/file', { params: { path: { mnemonic } } }),
    listMembers: (mnemonic: string) => c.GET('/fs/{mnemonic}/member/list', { params: { path: { mnemonic } } }),
    listFiles: (mnemonic: string) => c.GET('/fs/{mnemonic}/file/list', { params: { path: { mnemonic } } }),
    removeFile: (mnemonic: string) => c.POST('/fs/{mnemonic}/file/remove', { params: { path: { mnemonic } } }),
    addMember: (mnemonic: string, body: schemas["MemberAddBody"]) => c.POST('/fs/{mnemonic}/member/add', { params: { path: { mnemonic } }, body }),
    addDirectory: (name: string, parent?: string) => c.POST('/fs/directory/add', { body: { name, parent } }),
  };

  const download = {
    decrypt: (mnemonic: string, key: string) => c.POST('/download/{mnemonic}/decrypt', { params: { path: { mnemonic } }, body: { key } }),
    get: (token: string) => c.GET('/download', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      parseAs: 'stream',
    }),
    chunk: (uid: string, hash: string) => c.GET('/download/{uid}/chunk/{hash}', {
      parseAs: 'stream',
      params: { path: { uid, hash } }
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
    fs,
    upload,
    download,
    util,
  };
};
export default init;
