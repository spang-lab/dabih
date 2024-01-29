/* eslint-env jest */

import initMemory from './memory.js';

let client = null;

beforeAll(async () => {
  client = await initMemory();
});

test('memory read/write', async () => {
  const key = 'memcached_test_key';
  const value = 'memcached_test_value';
  const lifetime = 10;

  await client.set(key, value, lifetime);
  const nValue = await client.get(key);
  await client.del(key);
  expect(nValue).toEqual(value);
});
test('memory empty read', async () => {
  const key = 'memcached_test_key';
  const value = await client.get(key);
  expect(value).toEqual(null);
});
