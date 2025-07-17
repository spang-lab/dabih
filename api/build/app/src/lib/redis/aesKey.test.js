import app from 'src/app';
import getPort from '@ava/get-port';
import { test } from '#ava';
import { storeKey, readKey, deleteKey } from './aesKey';
test.before(async (t) => {
    const port = await getPort();
    const server = await app(port);
    t.context = {
        server,
        port,
        users: {},
        files: {},
        directories: {},
    };
});
test.after.always((t) => {
    t.context.server.close();
});
test('store and read', async (t) => {
    const mnemonic = 'test_mnemonic';
    const key = 'test_key';
    const sub = 'test_sub';
    await storeKey(sub, mnemonic, key);
    const result = await readKey(sub, mnemonic);
    t.is(result, key);
});
test('store and read different sub', async (t) => {
    const mnemonic = 'test_mnemonic';
    const key = 'test_key';
    await storeKey('test_sub', mnemonic, key);
    const result = await readKey('test_sub2', mnemonic);
    t.is(result, null);
});
test('store and read different mnemonic', async (t) => {
    const key = 'test_key';
    const sub = 'test_sub';
    await storeKey(sub, 'test_mnemonic', key);
    const result = await readKey(sub, 'test_mnemonic2');
    t.is(result, null);
});
test('store delete and read', async (t) => {
    const mnemonic = 'test_mnemonic';
    const key = 'test_key';
    const sub = 'test_sub';
    await storeKey(sub, mnemonic, key);
    await deleteKey(sub, mnemonic);
    const result = await readKey(sub, mnemonic);
    t.is(result, null);
});
//# sourceMappingURL=aesKey.test.js.map