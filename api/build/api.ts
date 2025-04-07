import createClient from 'openapi-fetch';

import type { components, paths } from './schema';
type schemas = components['schemas'];

type ChunkUpload = {
  mnemonic: string;
  hash: string;
  start: number;
  end: number;
  size?: number;
  data: Blob;
};

const contentRange = (ck: ChunkUpload) => {
  if (!ck.size) {
    return `bytes ${ck.start}-${ck.end}/*`;
  }
  return `bytes ${ck.start}-${ck.end}/${ck.size}`;
};

const init = (baseUrl: string) => {
  const c = createClient<paths>({
    baseUrl,
  });

  const token = {
    info: () => c.GET('/token/info'),
    add: (body: schemas['TokenAddBody']) => c.POST('/token/add', { body }),
    remove: (id: number) => c.POST('/token/remove', { body: { tokenId: id } }),
    list: () => c.GET('/token/list'),
  };
  const user = {
    add: (body: schemas['UserAddBody']) => c.POST('/user/add', { body }),
    me: () => c.GET('/user/me'),
    find: (sub: string) => c.POST('/user/find', { body: { sub } }),
    list: () => c.GET('/user/list'),
    remove: (sub: string) => c.POST('/user/remove', { body: { sub } }),
    addKey: (body: schemas['KeyAddBody']) => c.POST('/user/key/add', { body }),
    enableKey: (body: schemas['KeyEnableBody']) =>
      c.POST('/user/key/enable', { body }),
    removeKey: (body: schemas['KeyRemoveBody']) =>
      c.POST('/user/key/remove', { body }),
  };
  const upload = {
    start: (body: schemas['UploadStartBody']) =>
      c.POST('/upload/start', { body }),
    chunk: (ck: ChunkUpload) => {
      return c.PUT('/upload/{mnemonic}/chunk', {
        params: {
          path: { mnemonic: ck.mnemonic },
          header: {
            'content-range': contentRange(ck),
            digest: `sha-256=${ck.hash}`,
          },
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
    cancel: (mnemonic: string) =>
      c.POST('/upload/{mnemonic}/cancel', { params: { path: { mnemonic } } }),
    finish: (mnemonic: string) =>
      c.POST('/upload/{mnemonic}/finish', { params: { path: { mnemonic } } }),
    unfinished: () => c.GET('/upload/unfinished'),
  };

  const fs = {
    file: (mnemonic: string) =>
      c.GET('/fs/{mnemonic}/file', { params: { path: { mnemonic } } }),
    listParents: (mnemonic: string) =>
      c.GET('/fs/{mnemonic}/parent/list', { params: { path: { mnemonic } } }),
    listFiles: (mnemonic: string) =>
      c.GET('/fs/{mnemonic}/file/list', { params: { path: { mnemonic } } }),
    addMember: (mnemonic: string, body: schemas['MemberAddBody']) =>
      c.POST('/fs/{mnemonic}/member/add', {
        params: { path: { mnemonic } },
        body,
      }),
    addDirectory: (name: string, parent?: string) =>
      c.POST('/fs/directory/add', { body: { name, parent } }),
    move: (body: schemas['MoveInodeBody']) => c.POST('/fs/move', { body }),
    remove: (mnemonic: string) =>
      c.POST('/fs/{mnemonic}/remove', { params: { path: { mnemonic } } }),
    duplicate: (mnemonic: string) =>
      c.POST('/fs/{mnemonic}/duplicate', { params: { path: { mnemonic } } }),
    tree: (mnemonic: string) =>
      c.GET('/fs/{mnemonic}/tree', { params: { path: { mnemonic } } }),
    list: (mnemonic: string | null) => {
      if (!mnemonic) {
        return c.GET('/fs/list');
      }
      return c.GET('/fs/{mnemonic}/list', { params: { path: { mnemonic } } });
    },
    searchStart: (body: schemas['InodeSearchBody']) =>
      c.POST('/fs/search', { body }),
    searchResults: (jobId: string) =>
      c.POST('/fs/search/{jobId}', {
        params: { path: { jobId } },
      }),
    searchCancel: (jobId: string) =>
      c.POST('/fs/search/{jobId}/cancel', {
        params: { path: { jobId } },
      }),
  };

  const download = {
    decrypt: (mnemonic: string, key: string) =>
      c.POST('/download/{mnemonic}/decrypt', {
        params: { path: { mnemonic } },
        body: { key },
      }),
    get: (token: string) =>
      c.GET('/download', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        parseAs: 'stream',
      }),
    chunk: (uid: string, hash: string) =>
      c.GET('/download/{uid}/chunk/{hash}', {
        parseAs: 'stream',
        params: { path: { uid, hash } },
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
