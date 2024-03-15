import Router from '@koa/router';
import { koaBody } from 'koa-body';

import {
  auth,
  logRequests,
  error,
  requireScope,
  transaction,
} from '../middleware/index.js';

import healthy from './healthy.js';
import info from './info.js';

import dataset from './dataset/index.js';
import upload from './upload/index.js';
import key from './key/index.js';
import token from './token/index.js';

const getUploadRouter = () => {
  const router = new Router();
  router.use(requireScope('upload'));

  router.get('/check', upload.check);
  router.post('UPLOAD_START', '/start', upload.start);
  router.put('/:mnemonic/chunk', upload.chunk);
  router.post('UPLOAD_FINISH', '/:mnemonic/finish', upload.finish);
  router.post('UPLOAD_CANCEL', '/:mnemonic/cancel', upload.cancel);
  return router;
};

const getDatasetRouter = () => {
  const router = new Router();
  router.get('DATASET_DOWNLOAD', '/:mnemonic/download', requireScope('download'), dataset.download);
  router.use(requireScope('dataset'));

  router.post('/search', dataset.search);
  router.post('/find', dataset.find);
  router.get('/:mnemonic', dataset.mnemonic);
  router.get('/:mnemonic/chunk/:chunkHash', dataset.chunk);
  router.post('DATASET_REMOVE', '/:mnemonic/remove', dataset.remove);
  router.post('DATASET_RECOVER', '/:mnemonic/recover', dataset.recover);
  router.post('DATASET_DESTROY', '/:mnemonic/destroy', dataset.destroy);
  router.post(
    'DATASET_MEMBER_ADD',
    '/:mnemonic/member/add',
    dataset.addMembers,
  );
  router.post('DATASET_MEMBER_SET', '/:mnemonic/member/set', dataset.setAccess);
  router.post('DATASET_REENCRYPT', '/:mnemonic/reencrypt', dataset.reencrypt);
  router.post('DATASET_RENAME', '/:mnemonic/rename', dataset.rename);
  router.post('DATASET_STORE_KEY', '/:mnemonic/download', dataset.storeKey);
  router.get('DATASET_KEY_FETCH', '/:mnemonic/key', dataset.key);
  router.get('/orphan/list', dataset.listOrphans);

  return router;
};

const getKeyRouter = () => {
  const router = new Router();
  router.use(requireScope('key'));
  router.get('/list', key.list);
  router.post('KEY_ADD', '/add', key.add);
  router.post('/enable', key.enable);
  router.post('/check', key.check);
  router.post('KEY_REMOVE', '/remove', key.remove);

  return router;
};

const getTokenRouter = () => {
  const router = new Router();
  router.post('/', token.user);
  router.use(requireScope('token'));
  router.post('/add', token.add);
  router.get('/list', token.list);
  router.post('/remove', token.remove);

  return router;
};

const getApiRouter = () => {
  const router = new Router();
  router.use(logRequests);
  router.use(transaction);
  router.use(auth());

  const uploadRouter = getUploadRouter();
  router.use('/upload', uploadRouter.routes(), uploadRouter.allowedMethods());

  const datasetRouter = getDatasetRouter();
  router.use(
    '/dataset',
    datasetRouter.routes(),
    datasetRouter.allowedMethods(),
  );

  const keyRouter = getKeyRouter();
  router.use('/key', keyRouter.routes(), keyRouter.allowedMethods());

  const tokenRouter = getTokenRouter();
  router.use('/token', tokenRouter.routes(), tokenRouter.allowedMethods());

  return router;
};

const getRouter = () => {
  const router = new Router();
  router.use(error);
  router.use(koaBody());

  router.get('/healthy', healthy);
  router.get('/api/v1/healthy', healthy);
  router.get('/api/v1/info', info);
  const apiRouter = getApiRouter();

  router.use('/api/v1', apiRouter.routes(), apiRouter.allowedMethods());
  return router;
};

export default getRouter;
