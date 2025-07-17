import createClient from '../../build/api';
import crypto from '#crypto';
import avaTest from 'ava';
import { getSecret, SECRET } from './redis/secrets';
export const test = avaTest;
export const client = async (t, sub, admin) => {
    const { port } = t.context;
    const host = `http://localhost:${port}`;
    const baseUrl = `${host}/api/v1`;
    let scope = 'dabih:upload dabih:api';
    if (admin) {
        scope += ' dabih:admin';
    }
    const secret = await getSecret(SECRET.AUTH);
    const token = crypto.jwt.signWithSecret({
        sub,
        scope,
    }, secret);
    const middleware = {
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
    const addFile = async (tag, info) => {
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
                hash: await crypto.hash.blob(chunkData),
                data: chunkData,
            };
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
    const addDirectory = async (name, parent) => {
        const { data: directory, error } = await api.fs.addDirectory(name, parent);
        if (error) {
            t.fail(error);
        }
        t.context.directories[name] = directory.mnemonic;
    };
    const addUser = async (sub, root) => {
        const privateKey = await crypto.privateKey.generate();
        const publicKey = crypto.privateKey.toPublicKey(privateKey);
        const jwk = crypto.publicKey.toJwk(publicKey);
        const user = {
            sub,
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
};
//# sourceMappingURL=ava.js.map