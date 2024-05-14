import anyTest, { TestFn } from 'ava';
import Keyv from 'keyv';
import { initKeyV, storeKey, readKey, deleteKey } from './keyv';

const test = anyTest as TestFn<{ store: Keyv<string>, key: string }>;


test.before(async () => {
  await initKeyV('memory', 'test_secret');
});

test('store and read', async t => {
  const mnemonic = 'test_mnemonic';
  const key = 'test_key';
  const sub = 'test_sub';
  await storeKey(sub, mnemonic, key);
  const result = await readKey(sub, mnemonic);
  t.is(result, key);
});

test('store and read different sub', async t => {
  const mnemonic = 'test_mnemonic';
  const key = 'test_key';
  await storeKey('test_sub', mnemonic, key);
  const result = await readKey('test_sub2', mnemonic);
  t.is(result, null);
});

test('store and read different mnemonic', async t => {
  const key = 'test_key';
  const sub = 'test_sub';
  await storeKey(sub, 'test_mnemonic', key);
  const result = await readKey(sub, 'test_mnemonic2');
  t.is(result, null);
});

test('store delete and read', async t => {
  const mnemonic = 'test_mnemonic';
  const key = 'test_key';
  const sub = 'test_sub';
  await storeKey(sub, mnemonic, key);
  await deleteKey(sub, mnemonic);
  const result = await readKey(sub, mnemonic);
  t.is(result, null);
});
