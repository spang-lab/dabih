import createClient from 'openapi-fetch';
const contentRange = (ck) => {
    if (!ck.size) {
        return `bytes ${ck.start}-${ck.end}/*`;
    }
    return `bytes ${ck.start}-${ck.end}/${ck.size}`;
};
const init = (baseUrl) => {
    const c = createClient({
        baseUrl,
    });
    const auth = {
        info: () => c.GET('/auth/info'),
        refresh: (token) => c.POST('/auth/refresh', {
            headers: { Authorization: `Bearer ${token}` },
        }),
        signIn: (email) => c.POST('/auth/signIn', { body: { email } }),
        verify: (token) => c.POST('/auth/verify', { body: { token } }),
    };
    const token = {
        add: (body) => c.POST('/token/add', { body }),
        remove: (id) => c.POST('/token/remove', { body: { tokenId: id } }),
        list: () => c.GET('/token/list'),
    };
    const user = {
        add: (body) => c.POST('/user/add', { body }),
        me: () => c.GET('/user/me'),
        find: (sub) => c.POST('/user/find', { body: { sub } }),
        list: () => c.GET('/user/list'),
        remove: (sub) => c.POST('/user/remove', { body: { sub } }),
        addKey: (body) => c.POST('/user/key/add', { body }),
        enableKey: (body) => c.POST('/user/key/enable', { body }),
        removeKey: (body) => c.POST('/user/key/remove', { body }),
    };
    const upload = {
        start: (body) => c.POST('/upload/start', { body }),
        chunk: (ck) => {
            return c.PUT('/upload/{mnemonic}/chunk', {
                params: {
                    path: { mnemonic: ck.mnemonic },
                    header: {
                        'content-range': contentRange(ck),
                        digest: `sha-256=${ck.hash}`,
                    },
                },
                body: {
                    chunk: ck.data,
                },
                bodySerializer: (body) => {
                    const fd = new FormData();
                    if (body?.chunk) {
                        fd.append('chunk', body.chunk);
                    }
                    return fd;
                },
            });
        },
        cancel: (mnemonic) => c.POST('/upload/{mnemonic}/cancel', { params: { path: { mnemonic } } }),
        finish: (mnemonic) => c.POST('/upload/{mnemonic}/finish', { params: { path: { mnemonic } } }),
        unfinished: () => c.GET('/upload/unfinished'),
    };
    const fs = {
        file: (mnemonic) => c.GET('/fs/{mnemonic}/file', { params: { path: { mnemonic } } }),
        listParents: (mnemonic) => c.GET('/fs/{mnemonic}/parent/list', { params: { path: { mnemonic } } }),
        listFiles: (mnemonic) => c.GET('/fs/{mnemonic}/file/list', { params: { path: { mnemonic } } }),
        addMember: (mnemonic, body) => c.POST('/fs/{mnemonic}/member/add', {
            params: { path: { mnemonic } },
            body,
        }),
        addDirectory: (name, parent) => c.POST('/fs/directory/add', { body: { name, parent } }),
        move: (body) => c.POST('/fs/move', { body }),
        remove: (mnemonic) => c.POST('/fs/{mnemonic}/remove', { params: { path: { mnemonic } } }),
        duplicate: (mnemonic) => c.POST('/fs/{mnemonic}/duplicate', { params: { path: { mnemonic } } }),
        tree: (mnemonic) => c.GET('/fs/{mnemonic}/tree', { params: { path: { mnemonic } } }),
        list: (mnemonic) => {
            if (!mnemonic) {
                return c.GET('/fs/list');
            }
            return c.GET('/fs/{mnemonic}/list', { params: { path: { mnemonic } } });
        },
        searchStart: (body) => c.POST('/fs/search', { body }),
        searchResults: (jobId) => c.POST('/fs/search/{jobId}', {
            params: { path: { jobId } },
        }),
        searchCancel: (jobId) => c.POST('/fs/search/{jobId}/cancel', {
            params: { path: { jobId } },
        }),
    };
    const download = {
        decrypt: (mnemonic, key) => c.POST('/download/{mnemonic}/decrypt', {
            params: { path: { mnemonic } },
            body: { key },
        }),
        get: (token) => c.GET('/download', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            parseAs: 'stream',
        }),
        chunk: (uid, hash) => c.GET('/download/{uid}/chunk/{hash}', {
            parseAs: 'stream',
            params: { path: { uid, hash } },
        }),
        chunkBuf: (uid, hash) => c.GET('/download/{uid}/chunk/{hash}', {
            parseAs: 'arrayBuffer',
            params: { path: { uid, hash } },
        }),
    };
    const util = {
        healthy: () => c.GET('/healthy'),
        info: () => c.GET('/info'),
    };
    return {
        client: c,
        auth,
        token,
        user,
        fs,
        upload,
        download,
        util,
    };
};
export default init;
//# sourceMappingURL=api.js.map