import Router from '@koa/router';
import { koaBody } from 'koa-body';

import {
  auth,
  logRequests,
  catchError,
  requireScopes,
  transaction,
  logEvents,
} from '../middleware/index.js';

import healthy from './healthy.js';
import info from './info.js';

import dataset from './dataset/index.js';
import upload from './upload/index.js';
import key from './key/index.js';
import admin from './admin/index.js';
import token from './token/index.js';

const getAdminRouter = () => {
  const router = new Router();
  router.use(requireScopes('admin'));

  router.post('KEY_CONFIRM', '/key/confirm', admin.confirmKey);
  router.get('/dataset/orphan', admin.listOrphans);

  router.get('/events', admin.listEventDates);
  router.get('/events/:date', admin.listEvents);

  return router;
};

const getUploadRouter = () => {
  const router = new Router();
  router.use(requireScopes(['upload', 'api']));

  router.get('/check', upload.check);
  router.post('UPLOAD_START', '/start', upload.start);
  router.put('/:mnemonic', upload.chunk);
  router.post('UPLOAD_FINISH', '/finish/:mnemonic', upload.finish);
  router.post('UPLOAD_CANCEL', '/cancel/:mnemonic', upload.cancel);
  return router;
};

const getDatasetRouter = () => {
  const router = new Router();
  router.get('DATASET_DOWNLOAD', '/:mnemonic/download', requireScopes('download'), dataset.download);
  router.use(requireScopes('api'));

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
  router.post('DATASET_KEY_FETCH', '/:mnemonic/key', dataset.key);

  return router;
};

const getKeyRouter = () => {
  const router = new Router();
  router.use(requireScopes('api'));
  router.get('/list', key.list);
  router.post('KEY_ADD', '/add', key.add);
  router.post('/check', key.check);
  router.post('KEY_REMOVE', '/remove', key.remove);

  return router;
};

const getTokenRouter = () => {
  const router = new Router();
  router.post('/', token.user);
  router.post('/generate/:type', requireScopes('api'), token.generate);
  router.get('/list', requireScopes('api'), token.list);
  router.post('/remove', requireScopes('api'), token.remove);

  return router;
};

const getApiRouter = () => {
  const router = new Router();
  router.use(logRequests);
  router.use(transaction);
  router.use(auth());
  router.use(logEvents);

  const adminRouter = getAdminRouter();
  router.use('/admin', adminRouter.routes(), adminRouter.allowedMethods());

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
  router.use(catchError);
  router.use(koaBody());

  router.get('/healthy', healthy);
  router.get('/api/v1/healthy', healthy);
  router.get('/api/v1/info', info);
  const apiRouter = getApiRouter();

  router.use('/api/v1', apiRouter.routes(), apiRouter.allowedMethods());
  return router;
};

export default getRouter;
