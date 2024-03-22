const get = async (url: string) => {
  try {
    const response = await fetch(`/api/v1${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const message = await response.text();
      return { error: message };
    }
    const contentType = response.headers.get('Content-Type');
    if (contentType === 'application/octet-stream') {
      return await response.blob();
    }
    return await response.json();
  } catch (err: any) {
    return { error: err.toString() };
  }
};

const post = async (url: string, data?: object) => {
  try {
    const response = await fetch(`/api/v1${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: (data) ? JSON.stringify(data) : null,
    });
    if (!response.ok) {
      const message = await response.text();
      return { error: message };
    }
    return await response.json();
  } catch (err: any) {
    return { error: err.toString() };
  }
};
const put = async (url: string, data: any, headers: any) => {
  try {
    const response = await fetch(`/api/v1${url}`, {
      method: 'PUT',
      headers,
      body: data,
    });
    if (!response.ok) {
      const message = await response.text();
      return { error: message };
    }
    return await response.json();
  } catch (err: any) {
    return { error: err.toString() };
  }
};

type KeyData = {
  key: any,
  isRootKey: boolean,
  name: string,
  email: string,
};

const key = {
  list: () => get('/key/list'),
  add: (keyData: KeyData) => post('/key/add', keyData),
  check: (keyHash?: string) => post('/key/check', { keyHash }),
  remove: (keyId: number) => post('/key/remove', { keyId }),
  enable: (keyId: number, enabled: boolean) => post('/key/enable', { keyId, enabled }),
};

const token = {
  get: () => get('/token'),
  add: (scopes: Array<string>, lifetime: number | null) => post('/token/add', { scopes, lifetime }),
  list: () => get('/token/list'),
  remove: (tokenId: number) => post('/token/remove', { tokenId }),
};

type UploadInfo = {
  name: string | null,
  fileName: string,
  path: string | null,
  size: number,
  chunkHash: string | null,
};

type ChunkInfo = {
  mnemonic: string,
  start: number,
  end: number,
  size: number,
  hash: string,
  data: Blob,
};

const upload = {
  check: () => get('/upload/check'),
  start: (info: UploadInfo) => post('/upload/start', info),
  chunk: (chunk: ChunkInfo) => {
    const {
      start, end, hash, data, size, mnemonic,
    } = chunk;
    const body = new FormData();
    body.append('chunk', data);
    return put(`/upload/${mnemonic}/chunk`, body, {
      Digest: `sha-256=${hash}`,
      'Content-Range': `bytes ${start}-${end}/${size}`,
      // 'Content-Type': 'multipart/form-data',
    });
  },
  finish: (mnemonic: string) => post(`/upload/${mnemonic}/finish`),
  cancel: (mnemonic: string) => post(`/upload/${mnemonic}/cancel`),
};

type SearchRequest = {
  query?: string,
  uploader?: boolean,
  deleted?: boolean,
  all?: boolean,
  page: number,
  limit: number,
  direction?: string,
};
type FindRequest = {
  id: number | undefined,
  mnemonic: string | undefined,
  name: string | undefined,
  fileName: string | undefined,
  path: string | undefined,
  hash: string | undefined,
  size: number | undefined,
};

const dataset = {
  search: (search: SearchRequest) => post('/dataset/search', search),
  find: (search: FindRequest) => post('/dataset/find', search),
  get: (mnemonic: string) => get(`/dataset/${mnemonic}`),
  key: (mnemonic: string, keyHash: string) => post(`/dataset/${mnemonic}/key`, { keyHash }),
  chunk: (mnemonic: string, hash: string) => get(`/dataset/${mnemonic}/chunk/${hash}`),
  remove: (mnemonic: string) => post(`/dataset/${mnemonic}/remove`),
  recover: (mnemonic: string) => post(`/dataset/${mnemonic}/recover`),
  destroy: (mnemonic: string) => post(`/dataset/${mnemonic}/destroy`),
  rename: (mnemonic: string, name: string) => post(`/dataset/${mnemonic}/rename`, { name }),
  reencrypt: (mnemonic: string, aesKey: string) => post(`/dataset/${mnemonic}/reencrypt`, { key: aesKey }),
  addMember: (mnemonic: string, member: string, aesKey: string) => post(`/dataset/${mnemonic}/member/add`, { member, key: aesKey }),
  setAccess: (mnemonic: string, member: string, permission: string) => post(`/dataset/${mnemonic}/member/set`, { member, permission }),
  storeKey: (mnemonic: string, aesKey: string) => post(`/dataset/${mnemonic}/download`, { key: aesKey }),
  listOrphans: () => get('/dataset/orphan/list'),
};

const info = () => get('/info');

const api = {
  upload,
  dataset,
  key,
  token,
  info,
};
export default api;
