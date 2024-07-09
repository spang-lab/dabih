import jwt from 'jsonwebtoken';
import { requireEnv } from './env';
import createClient from 'build/api';
import { Middleware } from 'openapi-fetch';
import crypto from '#crypto';

import { Server } from 'http';
import avaTest, { ExecutionContext, TestFn } from 'ava';
import { KeyObject } from 'crypto';




interface TestContext {
  server: Server;
  port: number;
  users: Record<string, KeyObject>;
  files: Record<string, string>;
  directories: Record<string, string>;
}
export type Test = ExecutionContext<TestContext>;
export const test = avaTest as TestFn<TestContext>;

export interface Upload {
  fileName?: string;
  data?: Blob;
  directory?: string;
  chunkSize?: number;
}

const hashBlob = async (data: Blob) => {
  const hash = crypto.hash.create();
  const buffer = Buffer.from(await data.arrayBuffer());
  hash.update(buffer);
  return hash.digest('base64url');
}



export const client = (t: Test, sub: string, admin?: boolean) => {
  const { port } = t.context;
  const host = `http://localhost:${port}`;
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

  const middleware: Middleware = {
    onRequest({ request }) {
      if (!request.headers.has('Authorization')) {
        request.headers.set('Authorization', `Bearer ${token}`);
      }
      return request;
    },
  };
  const api = createClient(baseUrl);
  api.client.use(middleware);

  const { upload } = api;

  const addFile = async (tag: string, info?: Upload) => {
    const oneMiB = 1024 * 1024;
    const chunkSize = info?.chunkSize ?? 2 * oneMiB;
    const data = info?.data ?? new Blob([await crypto.random.getToken(10)]);
    const fileName = info?.fileName ?? `unnamed_file_${await crypto.random.getToken(4)}.txt`;
    const directory = info?.directory ?? undefined;

    const uploadInfo = {
      fileName,
      directory,
      tag,
    };
    const { data: dataset, error } = await upload.start(uploadInfo);
    if (error) {
      t.fail(error);
    }
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
      const { error } = await upload.chunk(chunk);
      if (error) {
        t.fail(error);
      }
      cursor += chunkSize;
    }
    const hash = hasher.digest('base64url');
    const { data: result, error: error2 } = await upload.finish(mnemonic);
    if (error2) {
      t.fail(error2);
    }
    t.is(result.data.hash, hash);
    t.context.files[tag] = mnemonic;
    return result;
  };
  const addDirectory = async (name: string, parent?: string) => {
    const { data: directory, error } = await api.fs.addDirectory(name, parent);
    if (error) {
      t.fail(error);
    }
    t.context.directories[name] = directory.mnemonic;
  }

  const addUser = async (sub: string, root?: boolean) => {
    const privateKey = await crypto.privateKey.generate();
    const publicKey = crypto.privateKey.toPublicKey(privateKey);
    const jwk = crypto.publicKey.toJwk(publicKey);
    const user = {
      sub,
      name: sub,
      email: `${sub}@test.com`,
      key: jwk,
      isRootKey: root,
    };
    const { error } = await api.user.add(user);
    if (error) {
      t.fail(error);
    }
    t.context.users[sub] = privateKey;
  };


  return {
    ...api,
    test: {
      addFile,
      addDirectory,
      addUser,
    },
  };
}

