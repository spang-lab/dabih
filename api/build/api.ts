import createClient from "openapi-fetch";
import { createHash } from 'crypto';

import type { components, paths } from './schema';
type schemas = components["schemas"];


const hashBlob = async (data: Blob) => {
  const hash = createHash('sha256');
  const buffer = Buffer.from(await data.arrayBuffer());
  hash.update(buffer);
  return hash.digest('base64url');
}


interface Chunk {
  mnemonic: string;
  start: number;
  end: number;
  size: number;
  hash: string;
  data: Blob;
}

type Upload = schemas["UploadStartBody"] & {
  data: Blob;
};
interface UploadOptions {
  /**
    * The size of each chunk in bytes
    */
  chunkSize: number;
};

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
    chunk: (mnemonic: string, hash: string) => c.GET('/download/{mnemonic}/chunk/{hash}', {
      parseAs: 'stream',
      params: { path: { mnemonic, hash } }
    }),
  };

  const uploadBlob = async (info: Upload, options?: UploadOptions) => {
    const oneMiB = 1024 * 1024;
    const chunkSize = options?.chunkSize ?? 2 * oneMiB;

    const uploadInfo = {
      ...info,
      data: undefined,
    };

    const { data: dataset, response, error } = await upload.start(uploadInfo);
    if (error) {
      console.error(error);
      return { response, error };
    }
    const { data } = info;
    const { mnemonic } = dataset;
    let cursor = 0;
    const hasher = createHash('sha256');
    while (cursor < data.size) {
      const chunkData = data.slice(cursor, cursor + chunkSize);
      const chunk: Chunk = {
        mnemonic,
        start: cursor,
        end: cursor + chunkData.size - 1,
        size: data.size,
        hash: await hashBlob(chunkData),
        data: chunkData,
      }
      hasher.update(chunk.hash, 'base64url');
      const { response, error } = await upload.chunk(chunk);
      if (error) {
        console.error(error);
        return { response, error };
      }
      cursor += chunkSize;
    }
    const hash = hasher.digest('base64url');
    const { data: result, response: response2, error: error2 } = await upload.finish(mnemonic);
    if (error2) {
      console.error(error2);
      return { response: response2, error: error2 };
    }
    if (result.hash !== hash) {
      console.error("Hash mismatch", result.hash, hash);
      return { response: response2, error: { message: "Hash mismatch" } };
    }
    return {
      data: result,
    }
  };


  return {
    client: c,
    token,
    user,
    upload: {
      ...upload,
      blob: uploadBlob,
    },
    dataset,
    download
  };
};
export default init;
