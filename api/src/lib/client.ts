import jwt from 'jsonwebtoken';
import { getEnv, requireEnv } from './env';
import createClient from 'build/api';
import { createHash } from 'crypto';
import { Middleware } from 'openapi-fetch';

const init = (port?: number, sub?: string) => {
  const p = port?.toString() ?? getEnv('PORT', '3001');
  const host = `http://localhost:${p}`;
  const baseUrl = `${host}/api/v1`;

  const tokenSecret = requireEnv("TOKEN_SECRET");
  const token = jwt.sign({
    sub: sub ?? "admin",
    scope: "dabih:upload dabih:api dabih:admin",
    aud: host,
  }, tokenSecret);

  const tokenMiddleware: Middleware = {
    onRequest(req) {
      if (!req.headers.has('Authorization')) {
        req.headers.set('Authorization', `Bearer ${token}`);
      }
      return req;
    },
  };
  const api = createClient(baseUrl);
  api.client.use(tokenMiddleware);

  const uploadBlob = async (fileName: string, data: Blob, name?: string) => {
    const { data: dataset, response, error } = await api.upload.start({ fileName, name });
    if (error) {
      console.error(error);
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
    const { response: response2, error: error2 } = await api.upload.chunk(chunk);
    if (error2) {
      console.error(error2);
      return { response: response2, error: error2 };
    }
    const { response: response3, error: error3, data: result } = await api.upload.finish(mnemonic);
    if (error3) {
      console.error(error3);
      return { response: response3, error: error3 };
    }
    return {
      data: result,
    }
  }

  return api;
}


export default init;
