import app from '../../../src/app';
import getPort from '@ava/get-port';
import { test, client } from '#ava';
import crypto from '#crypto';
import { InodeType } from '../types';
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
    const api = await client(t, 'owner', true);
    await api.test.addUser('owner');
    await api.test.addUser('member_A');
    await api.test.addUser('member_B');
    await api.test.addDirectory('test_dir');
    await api.test.addDirectory('test_dir_A', t.context.directories.test_dir);
    await api.test.addDirectory('test_dir_B', t.context.directories.test_dir);
    await api.test.addDirectory('test_dir_rm');
    await api.fs.addMember(t.context.directories.test_dir_A, {
        subs: ['member_A'],
        keys: [],
    });
    await api.fs.addMember(t.context.directories.test_dir_B, {
        subs: ['member_B'],
        keys: [],
    });
    await api.test.addFile('File_A', {
        fileName: 'test.txt',
        chunkSize: 5,
        data: new Blob(['test data']),
        directory: t.context.directories.test_dir_A,
    });
    await api.test.addFile('File_B', {
        directory: t.context.directories.test_dir_A,
    });
    await api.test.addFile('File_C', {
        directory: t.context.directories.test_dir_A,
    });
    await api.test.addFile('File_D', {
        directory: t.context.directories.test_dir,
    });
    await api.test.addFile('File_E', {
        directory: t.context.directories.test_dir_rm,
    });
});
test.after.always((t) => {
    t.context.server.close();
});
test('file', async (t) => {
    const api = await client(t, 'owner');
    const mnemonic = t.context.files.File_A;
    const { data: info } = await api.fs.file(mnemonic);
    if (!info) {
        t.fail();
        return;
    }
    const { data } = info;
    t.is(data.fileName, 'test.txt');
    t.is(data.chunks.length, 2);
    t.is(data.size, '9');
});
test('invalid mnemonic', async (t) => {
    const api = await client(t, 'owner');
    const { response } = await api.fs.file('invalid_mnemonic');
    t.is(response.status, 404);
});
test('mv file', async (t) => {
    const api = await client(t, 'owner');
    const mnemonic = t.context.files.File_A;
    const { data: file } = await api.fs.file(mnemonic);
    if (!file) {
        t.fail();
        return;
    }
    const key = crypto.fileData.decryptKey(t.context.users.owner, file);
    const { response } = await api.fs.move({
        mnemonic,
        parent: t.context.directories.test_dir_B,
        keys: [{ mnemonic, key }],
    });
    t.is(response.status, 204);
    const api2 = await client(t, 'member_B');
    const { response: response2 } = await api2.fs.file(mnemonic);
    t.is(response2.status, 200);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const api3 = await client(t, 'member_A');
    const { response: response3 } = await api3.fs.file(mnemonic);
    t.is(response3.status, 403);
});
test('mv file invalid', async (t) => {
    const api = await client(t, 'owner');
    const { response } = await api.fs.move({
        mnemonic: 'invalid_mnemonic',
        name: 'new_name',
    });
    t.is(response.status, 404);
});
test('duplicate', async (t) => {
    const api = await client(t, 'owner');
    const mnemonic = t.context.directories.test_dir;
    const { response, error, data: dir } = await api.fs.duplicate(mnemonic);
    t.is(response.status, 200);
    if (error ?? !dir) {
        t.fail(error);
        return;
    }
    const { data: files } = await api.fs.listFiles(mnemonic);
    const { data: files2 } = await api.fs.listFiles(dir.mnemonic);
    if (!files || !files2) {
        t.fail();
        return;
    }
    t.is(files.length, files2.length);
    const sorted = files.sort((a, b) => a.name.localeCompare(b.name));
    const sorted2 = files2.sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 0; i < files.length; i++) {
        t.is(sorted[i].name, sorted2[i].name);
    }
});
test('remove', async (t) => {
    const api = await client(t, 'owner');
    const mnemonic = t.context.files.File_E;
    const { response } = await api.fs.remove(mnemonic);
    t.is(response.status, 204);
    const { response: response2 } = await api.fs.remove(mnemonic);
    t.is(response2.status, 400);
    const { data } = await api.fs.list(null);
    if (!data?.children) {
        t.fail();
        return;
    }
    const { children } = data;
    const trash = children.find((inode) => inode.type === InodeType.TRASH);
    if (!trash) {
        t.fail('Trash not found');
        return;
    }
    const { data: files } = await api.fs.listFiles(trash.mnemonic);
    if (!files) {
        t.fail();
        return;
    }
    t.true(files.some((file) => file.mnemonic === mnemonic));
});
test('file list', async (t) => {
    const api = await client(t, 'owner');
    const { data: files, response } = await api.fs.listFiles(t.context.files.File_A);
    t.is(response.status, 200);
    if (!files) {
        t.fail();
        return;
    }
    t.is(files.length, 1);
});
test('add directory', async (t) => {
    const api = await client(t, 'owner');
    const { data: directory, response } = await api.fs.addDirectory('test_dir');
    t.is(response.status, 200);
    if (!directory) {
        t.fail();
        return;
    }
    t.is(directory.name, 'test_dir');
    const { data: child, response: response2 } = await api.fs.addDirectory('test_child', directory.mnemonic);
    t.is(response2.status, 200);
    if (!child) {
        t.fail();
        return;
    }
    t.is(child.name, 'test_child');
});
//# sourceMappingURL=fs.test.js.map