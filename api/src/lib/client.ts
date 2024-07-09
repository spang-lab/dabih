import jwt from 'jsonwebtoken';
import { getEnv, requireEnv } from './env';
import createClient from 'build/api';
import type { components } from 'build/schema';
type schemas = components["schemas"];
import { Middleware } from 'openapi-fetch';
import crypto from '#crypto';


type Upload = schemas["UploadStartBody"] & {
  data: Blob;
};
interface UploadOptions {
  /**
    * The size of each chunk in bytes
    */
  chunkSize: number;
};

const hashBlob = async (data: Blob) => {
  const hash = crypto.hash.create();
  const buffer = Buffer.from(await data.arrayBuffer());
  hash.update(buffer);
  return hash.digest('base64url');
}



const init = (port: number, sub: string, admin?: boolean) => {
  const p = port?.toString() ?? getEnv('PORT', '3001');
  const host = `http://localhost:${p}`;
  const baseUrl = `${host}/api/v1`;

  let scope = "dabih:upload dabih:api";
  if (admin) {
    scope += " dabih:admin";
  }
  const tokenSecret = requireEnv("TOKEN_SECRET");
  const token = jwt.sign({
    sub: sub ?? "admin",
    scope,
    aud: host,
  }, tokenSecret);

  const tokenMiddleware: Middleware = {
    onRequest({ request }) {
      if (!request.headers.has('Authorization')) {
        request.headers.set('Authorization', `Bearer ${token}`);
      }
      return request;
    },
  };
  const api = createClient(baseUrl);
  api.client.use(tokenMiddleware);

  const { upload } = api;

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
    const hasher = crypto.hash.create();
    while (cursor < data.size) {
      const chunkData = data.slice(cursor, cursor + chunkSize);
      const chunk = {
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
    if (result.data.hash !== hash) {
      console.error("Hash mismatch", result.data.hash, hash);
      return { response: response2, error: { message: "Hash mismatch" } };
    }
    return {
      data: result,
    }
  };




  return {
    ...api,
    upload: {
      ...upload,
      blob: uploadBlob,
    },
  };
}


export default init;
