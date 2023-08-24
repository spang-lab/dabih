/* eslint-disable no-await-in-loop */
import { Op } from 'sequelize';
import { getModel } from './util.js';
import { log, generateMnemonic, userHasScope } from '../../util/index.js';
import { base64ToBase64Url, rsa } from '../../crypto/index.js';
import search from './datasetSearch.js';

async function listIncomplete(ctx) {
  const dataset = getModel(ctx, 'Dataset');

  return dataset.findAll({
    raw: true,
    where: {
      hash: {
        [Op.is]: null,
      },
    },
  });
}

async function findMnemonic(ctx, mnemonic) {
  const Dataset = getModel(ctx, 'Dataset');
  const result = await Dataset.findOne({
    where: { mnemonic },
    paranoid: false,
  });
  if (!result) {
    return null;
  }
  return result.get({ plain: true });
}

async function fromMnemonic(ctx, mnemonic) {
  const dataset = await findMnemonic(ctx, mnemonic);
  if (!dataset) {
    throw new Error(`Dataset ${mnemonic} not found`);
  }
  return dataset;
}

async function listAll(ctx) {
  const Dataset = getModel(ctx, 'Dataset');
  return Dataset.findAll({
    raw: true,
  });
}

async function listAccessible(ctx, sub, options) {
  const searchOptions = {
    limit: null,
    offset: null,
    deleted: true,
    all: false,
    ...options,
  };

  const keepAll = searchOptions.all && userHasScope(ctx, 'admin');
  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');

  const results = await Dataset.findAll({
    include: {
      model: Member,
      as: 'members',
      attributes: ['permission', 'sub'],
      paranoid: !searchOptions.deleted,
      where: {
        sub,
      },
    },
    where: {
      hash: {
        [Op.not]: null,
      },
    },
    order: [['createdAt', 'DESC']],
    paranoid: !searchOptions.deleted,
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
    .filter((dset) => keepAll || dset.permission !== 'none');

  return datasets;
}

async function create(ctx, properties) {
  const Dataset = getModel(ctx, 'Dataset');

  const maxTries = 3;
  for (let i = 0; i < maxTries; i += 1) {
    const mnemonic = generateMnemonic();
    const existing = await findMnemonic(ctx, mnemonic);
    if (!existing) {
      return Dataset.create({
        ...properties,
        mnemonic,
      });
    }
  }
  throw new Error('ID SPACE exhausted, this should never happen');
}

async function listMembers(ctx, mnemonic) {
  const Member = getModel(ctx, 'Member');

  const { id } = await fromMnemonic(ctx, mnemonic);
  const members = await Member.findAll({
    raw: true,
    where: {
      datasetId: id,
    },
  });
  return members;
}

async function getMemberAccess(ctx, mnemonic, sub) {
  const Member = getModel(ctx, 'Member');

  const { id } = await fromMnemonic(ctx, mnemonic);
  const entry = await Member.findOne({
    where: {
      datasetId: id,
      sub,
    },
  });
  return entry.permission;
}
async function setMemberAccess(ctx, mnemonic, sub, permission) {
  const Member = getModel(ctx, 'Member');

  const { id } = await fromMnemonic(ctx, mnemonic);

  await Member.update(
    { permission },
    {
      where: {
        datasetId: id,
        sub,
      },
    },
  );
}
async function addMember(ctx, mnemonic, sub, permission = 'read') {
  const Member = getModel(ctx, 'Member');

  const dataset = await fromMnemonic(ctx, mnemonic);

  const existing = await Member.findOne({
    where: {
      sub,
      datasetId: dataset.id,
    },
  });
  if (existing && existing.permission === 'none') {
    await setMemberAccess(ctx, mnemonic, sub, permission);
    return;
  }
  await Member.create({
    sub,
    permission,
    datasetId: dataset.id,
  });
}

async function addChunk(ctx, mnemonic, properties) {
  const Chunk = getModel(ctx, 'Chunk');

  const dataset = await fromMnemonic(ctx, mnemonic);
  await Chunk.create({
    ...properties,
    datasetId: dataset.id,
  });
}
async function listChunks(ctx, mnemonic) {
  const Chunk = getModel(ctx, 'Chunk');
  const { id } = await fromMnemonic(ctx, mnemonic);
  const chunks = await Chunk.findAll({
    raw: true,
    where: {
      datasetId: id,
    },
  });
  return chunks.map((c) => ({
    ...c,
    start: parseInt(c.start, 10),
    end: parseInt(c.end, 10),
    size: parseInt(c.size, 10),
    urlHash: base64ToBase64Url(c.hash),
  }));
}
async function updateChunk(ctx, chunkId, properties) {
  const Chunk = getModel(ctx, 'Chunk');
  await Chunk.update(properties, {
    where: {
      id: chunkId,
    },
  });
}

async function listPublicKeys(ctx, mnemonic) {
  const PublicKey = getModel(ctx, 'PublicKey');
  const members = await listMembers(ctx, mnemonic);
  const subs = members.map((m) => m.sub);
  const publicKeys = await PublicKey.findAll({
    raw: true,
    where: {
      [Op.or]: {
        sub: {
          [Op.or]: subs,
        },
        isRootKey: true,
      },
    },
  });
  return publicKeys;
}

async function addKeys(ctx, mnemonic, aesKey) {
  const Key = getModel(ctx, 'Key');

  const dataset = await fromMnemonic(ctx, mnemonic);
  const publicKeys = await listPublicKeys(ctx, mnemonic);
  const existing = await Key.findAll({
    raw: true,
    where: {
      datasetId: dataset.id,
    },
  });
  const missing = publicKeys.filter(
    (pk) => !existing.find((k) => k.id === pk.publicKeyId),
  );

  const promises = missing.map(async (publicKey) => {
    let key = publicKey.data;
    if (typeof (key) === 'string') {
      key = JSON.parse(publicKey.data);
    }
    const encrypted = rsa.encrypt(key, aesKey);
    await Key.create({
      key: encrypted,
      datasetId: dataset.id,
      publicKeyId: publicKey.id,
    });
  });
  await Promise.all(promises);
}

async function dropKeys(ctx, mnemonic) {
  const Key = getModel(ctx, 'Key');

  const dataset = await fromMnemonic(ctx, mnemonic);
  const publicKeys = await listPublicKeys(ctx, mnemonic);
  const publicKeyIds = publicKeys.map((k) => k.id);
  const surplus = await Key.findAll({
    raw: true,
    where: {
      datasetId: dataset.id,
      [Op.not]: {
        publicKeyId: {
          [Op.or]: publicKeyIds,
        },
      },
    },
  });
  const promises = surplus.map((key) => Key.destroy({
    where: {
      id: key.id,
    },
  }));
  await Promise.all(promises);
}

async function findKey(ctx, mnemonic, publicKeyId) {
  const Key = getModel(ctx, 'Key');
  const { id } = await fromMnemonic(ctx, mnemonic);
  return Key.findOne({
    where: {
      datasetId: id,
      publicKeyId,
    },
  });
}
async function destroyKeys(ctx, mnemonic) {
  const Key = getModel(ctx, 'Key');

  const { id } = await fromMnemonic(ctx, mnemonic);
  await Key.destroy({
    where: {
      datasetId: id,
    },
    force: true,
  });
}

async function destroy(ctx, mnemonic) {
  log.warn(`DESTROYING DATASET ${mnemonic}`);

  const { id } = await fromMnemonic(ctx, mnemonic);

  const Member = getModel(ctx, 'Member');
  await Member.destroy({
    where: {
      datasetId: id,
    },
    force: true,
  });
  const Key = getModel(ctx, 'Key');
  await Key.destroy({
    where: {
      datasetId: id,
    },
    force: true,
  });
  const Chunk = getModel(ctx, 'Chunk');
  await Chunk.destroy({
    where: {
      datasetId: id,
    },
    force: true,
  });
  const Dataset = getModel(ctx, 'Dataset');
  await Dataset.destroy({
    where: {
      id,
    },
    force: true,
  });
}

async function remove(ctx, mnemonic) {
  const { id } = await fromMnemonic(ctx, mnemonic);

  const Member = getModel(ctx, 'Member');
  await Member.destroy({
    where: {
      datasetId: id,
    },
  });
  const Key = getModel(ctx, 'Key');
  await Key.destroy({
    where: {
      datasetId: id,
    },
  });
  const Chunk = getModel(ctx, 'Chunk');
  await Chunk.destroy({
    where: {
      datasetId: id,
    },
  });
  const Dataset = getModel(ctx, 'Dataset');
  await Dataset.destroy({
    where: {
      id,
    },
  });
}

async function recover(ctx, mnemonic) {
  const { id } = await fromMnemonic(ctx, mnemonic);
  const Member = getModel(ctx, 'Member');
  await Member.restore({
    where: {
      datasetId: id,
    },
  });
  const Key = getModel(ctx, 'Key');
  await Key.restore({
    where: {
      datasetId: id,
    },
  });
  const Chunk = getModel(ctx, 'Chunk');
  await Chunk.restore({
    where: {
      datasetId: id,
    },
  });
  const Dataset = getModel(ctx, 'Dataset');
  await Dataset.restore({
    where: {
      id,
    },
  });
}

async function update(ctx, mnemonic, properties) {
  const Dataset = getModel(ctx, 'Dataset');
  await Dataset.update(properties, {
    where: {
      mnemonic,
    },
  });
}

export default {
  fromMnemonic,
  listAll,
  listIncomplete,
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
  ...search,
};
