
import jwt from 'jsonwebtoken';
import anyTest, { TestFn } from 'ava';
import app from 'src/app';
import { OpenAPI, TokenService } from 'build/client';
import { Server } from 'http';
import os from 'node:os';

const test = anyTest as TestFn<{ server: Server }>;
const tokenSecret = 'ava_unit_test_secret';
const port = 3042
const host = `http://localhost:${port}`;

OpenAPI.BASE = `${host}/api/v1`;
OpenAPI.TOKEN = async () => {
  const admin = {
    sub: "admin",
    scope: "upload key dataset token admin",
    aud: host,
  };
  return jwt.sign(admin, tokenSecret);
};


test.before(async t => {
  const tmp = os.tmpdir();
  process.env.PORT = port.toString();
  process.env.TOKEN_SECRET = tokenSecret;
  process.env.STORAGE_URL = `fs:${tmp}/dabih`;
  t.context = {
    server: await app()
  };
})

test.after.always(t => {
  t.context.server.close();
})

test('valid access token', async t => {
  const data = await TokenService.info();
  t.truthy(data);
  t.truthy(data.isAdmin);
})

test('create a dabih access_token', async t => {
  const token = await TokenService.add({
    requestBody: {
      scopes: ["upload"],
      lifetime: null
    },
  });
  t.truthy(token);
})
