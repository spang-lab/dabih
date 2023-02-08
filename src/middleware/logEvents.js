/* eslint-disable no-underscore-dangle */
import { getSub } from '../util/index.js';
import { events } from '../database/index.js';

const getMessage = (ctx, eventName) => {
  const { request } = ctx;
  const { body } = request;

  switch (eventName) {
    case 'KEY_CONFIRM':
      return `Key ${body.keyId} status set to ${body.confirmed}`;
    case 'KEY_REMOVE':
      return `Key ${body.keyId} deleted`;
    case 'DATASET_REMOVE':
      return 'Dataset removed';
    case 'DATASET_DESTROY':
      return 'Dataset irrevesibly destroyed';
    case 'KEY_ADD':
      return 'New key added';
    case 'DATASET_MEMBER_ADD':
      return `${body.members.join(', ')} added to dataset`;
    case 'DATASET_MEMBER_SET':
      return `${body.user} permission set to ${body.permission}`;
    case 'DATASET_REENCRYPT':
      return 'Dataset reencrypted';
    case 'UPLOAD_START':
      return `New upload ${ctx.body.mnemonic}`;
    case 'UPLOAD_FINISH':
      return 'Uploaded completed successfully';
    case 'DATASET_KEY_FETCH':
      return 'Encrypted key fetched';
    case 'DATASET_RENAME':
      return `Dataset renamed to '${body.name}'`;
    default:
      return `Event ${eventName}`;
  }
};

export default async (ctx, next) => {
  await next();

  const routeName = ctx._matchedRouteName;
  if (!routeName) {
    return;
  }
  const { status } = ctx.response;
  if (status !== 200) {
    return;
  }

  const sub = getSub(ctx);
  const { mnemonic } = ctx.params;

  const ev = {
    sub,
    mnemonic,
    event: routeName,
    message: getMessage(ctx, routeName),
  };
  await events.add(ctx, ev);
};
