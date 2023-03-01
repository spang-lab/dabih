/* eslint-disable no-await-in-loop */
import { Op } from 'sequelize';
import { getModel, getTx } from './util.js';
import { log, generateMnemonic } from '../../util/index.js';
import { rsa } from '../../crypto/index.js';

async function listIncomplete(ctx) {
  const dataset = getModel(ctx, 'Dataset');
  const tx = getTx(ctx);

  return dataset.findAllTx(tx, {
    hash: {
      [Op.is]: null,
    },
  });
}
async function listAll(ctx) {
  const Dataset = getModel(ctx, 'Dataset');
  const tx = getTx(ctx);
  return Dataset.findAll({
    transaction: tx,
  });
}

async function fromMnemonic(ctx, mnemonic) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const dataset = await Dataset.fromMnemonic(tx, mnemonic);
  return dataset.get({ plain: true });
}

async function listAccessible(ctx, sub) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');

  const results = await Dataset.findAll({
    include: {
      model: Member,
      as: 'members',
      attributes: ['permission', 'sub'],
      where: {
        deleted: {
          [Op.is]: null,
        },
      },
    },
    where: {
      hash: {
        [Op.not]: null,
      },
      deleted: {
        [Op.is]: null,
      },
    },
    order: [
      ['createdAt', 'DESC'],
    ],
    transaction: tx,
  });
  const datasets = results
    .map((dset) => {
      const plain = dset.get({ plain: true });
      let permission = 'none';
      const member = plain.members.find((m) => m.sub === sub);
      if (member) {
        permission = member.permission;
      }
      return {
        ...plain,
        permission,
      };
    })
    .filter((dset) => dset.permission !== 'none');

  return datasets;
}

async function findMnemonic(ctx) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const maxTries = 3;
  for (let i = 0; i < maxTries; i += 1) {
    const mnemonic = generateMnemonic();
    const existing = await Dataset.findOneTx(tx, { mnemonic });
    if (!existing) {
      return mnemonic;
    }
  }
  throw new Error('ID SPACE exhausted, this should never happen');
}
async function create(ctx, properties) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const mnemonic = await findMnemonic(ctx);
  const dataset = await Dataset.createTx(tx, {
    ...properties,
    mnemonic,
  });
  return dataset;
}

async function listMembers(ctx, mnemonic) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');

  const { id } = await Dataset.fromMnemonic(tx, mnemonic);
  const members = await Member.findAllTx(tx, {
    datasetId: id,
  });
  return members;
}

async function getMemberAccess(ctx, mnemonic, sub) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');

  const { id } = await Dataset.fromMnemonic(tx, mnemonic);
  const entry = await Member.findOneTx(tx, {
    datasetId: id,
    sub,
  });
  return entry.permission;
}
async function setMemberAccess(ctx, mnemonic, sub, permission) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');

  const { id } = await Dataset.fromMnemonic(tx, mnemonic);

  await Member.updateTx(tx, { permission }, {
    datasetId: id,
    sub,
  });
}
async function addMember(ctx, mnemonic, sub, permission = 'read') {
  const tx = getTx(ctx);
  const Member = getModel(ctx, 'Member');
  const Dataset = getModel(ctx, 'Dataset');

  const dataset = await Dataset.fromMnemonic(tx, mnemonic);

  const existing = await Member.findOneTx(tx, {
    sub,
    datasetId: dataset.id,
  });
  if (existing && existing.permission === 'none') {
    await setMemberAccess(ctx, mnemonic, sub, permission);
    return;
  }
  await Member.createTx(tx, {
    sub,
    permission,
    datasetId: dataset.id,
  });
}

async function addChunk(ctx, mnemonic, properties) {
  const tx = getTx(ctx);
  const Chunk = getModel(ctx, 'Chunk');
  const Dataset = getModel(ctx, 'Dataset');

  const dataset = await Dataset.fromMnemonic(tx, mnemonic);
  await Chunk.createTx(tx, {
    ...properties,
    datasetId: dataset.id,
  });
}
async function listChunks(ctx, mnemonic) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const Chunk = getModel(ctx, 'Chunk');
  const { id } = await Dataset.fromMnemonic(tx, mnemonic);
  const chunks = await Chunk.findAllTx(tx, {
    datasetId: id,
  });
  return chunks
    .map((c) => ({
      ...c,
      start: parseInt(c.start, 10),
      end: parseInt(c.end, 10),
      size: parseInt(c.size, 10),
    }));
}
async function updateChunk(ctx, chunkId, properties) {
  const tx = getTx(ctx);
  const Chunk = getModel(ctx, 'Chunk');
  await Chunk.updateTx(tx, properties, {
    id: chunkId,
  });
}

async function listPublicKeys(ctx, mnemonic) {
  const tx = getTx(ctx);
  const PublicKey = getModel(ctx, 'PublicKey');
  const members = await listMembers(ctx, mnemonic);
  const subs = members.map((m) => m.sub);
  const publicKeys = await PublicKey.findAllTx(tx, {
    [Op.or]: {
      sub: {
        [Op.or]: subs,
      },
      isRootKey: true,
    },
  });
  return publicKeys;
}

async function addKeys(ctx, mnemonic, aesKey) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const Key = getModel(ctx, 'Key');

  const dataset = await Dataset.fromMnemonic(tx, mnemonic);
  const publicKeys = await listPublicKeys(ctx, mnemonic);
  const existing = await Key.findAllTx(tx, {
    datasetId: dataset.id,
  });
  const missing = publicKeys.filter((pk) => !existing.find((k) => k.id === pk.publicKeyId));

  const promises = missing.map(async (publicKey) => {
    const key = JSON.parse(publicKey.data);
    const encrypted = rsa.encrypt(key, aesKey);
    await Key.createTx(tx, {
      key: encrypted,
      datasetId: dataset.id,
      publicKeyId: publicKey.id,
    });
  });
  await Promise.all(promises);
}

async function dropKeys(ctx, mnemonic) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const Key = getModel(ctx, 'Key');

  const dataset = await Dataset.fromMnemonic(tx, mnemonic);
  const publicKeys = await listPublicKeys(ctx, mnemonic);
  const publicKeyIds = publicKeys.map((k) => k.id);
  const surplus = await Key.findAllTx(tx, {
    datasetId: dataset.id,
    [Op.not]: {
      publicKeyId: {
        [Op.or]: publicKeyIds,
      },
    },
  });
  const promises = surplus.map((key) => Key.removeTx(tx, {
    id: key.id,
  }));
  await Promise.all(promises);
}

async function findKey(ctx, mnemonic, publicKeyId) {
  const tx = getTx(ctx);
  const Key = getModel(ctx, 'Key');
  const Dataset = getModel(ctx, 'Dataset');
  const { id } = await Dataset.fromMnemonic(tx, mnemonic);
  return Key.findOneTx(tx, {
    datasetId: id,
    publicKeyId,
  });
}
async function destroyKeys(ctx, mnemonic) {
  const tx = getTx(ctx);
  const Key = getModel(ctx, 'Key');
  const Dataset = getModel(ctx, 'Dataset');

  const { id } = await Dataset.fromMnemonic(tx, mnemonic);
  await Key.destroyTx(tx, {
    datasetId: id,
  });
}

async function destroy(ctx, mnemonic) {
  log.warn(`DESTROYING DATASET ${mnemonic}`);
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const Key = getModel(ctx, 'Key');
  const Chunk = getModel(ctx, 'Chunk');
  const Member = getModel(ctx, 'Member');

  const { id } = await Dataset.fromMnemonic(tx, mnemonic);

  await Member.destroyTx(tx, {
    datasetId: id,
  });
  await Key.destroyTx(tx, {
    datasetId: id,
  });
  await Chunk.destroyTx(tx, {
    datasetId: id,
  });
  await Dataset.destroyTx(tx, {
    id,
  });
}
async function remove(ctx, mnemonic) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const Key = getModel(ctx, 'Key');
  const Chunk = getModel(ctx, 'Chunk');
  const Member = getModel(ctx, 'Member');

  const { id } = await Dataset.fromMnemonic(tx, mnemonic);

  await Member.removeTx(tx, {
    datasetId: id,
  });
  await Key.removeTx(tx, {
    datasetId: id,
  });
  await Chunk.removeTx(tx, {
    datasetId: id,
  });
  await Dataset.removeTx(tx, {
    id,
  });
}

async function recover(ctx, mnemonic) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  const Key = getModel(ctx, 'Key');
  const Chunk = getModel(ctx, 'Chunk');
  const Member = getModel(ctx, 'Member');

  const { id } = await Dataset.fromMnemonic(tx, mnemonic);

  await Member.recoverTx(tx, {
    datasetId: id,
  });
  await Key.recoverTx(tx, {
    datasetId: id,
  });
  await Chunk.recoverTx(tx, {
    datasetId: id,
  });
  await Dataset.recoverTx(tx, {
    id,
  });
}

async function update(ctx, mnemonic, properties) {
  const tx = getTx(ctx);
  const Dataset = getModel(ctx, 'Dataset');
  await Dataset.updateTx(tx, properties, {
    mnemonic,
  });
}

export default {
  fromMnemonic,
  listIncomplete,
  listAll,
  listAccessible,
  create,
  addMember,
  listMembers,
  getMemberAccess,
  setMemberAccess,
  addKeys,
  dropKeys,
  destroyKeys,
  findKey,
  addChunk,
  listChunks,
  updateChunk,
  destroy,
  remove,
  recover,
  update,
};
