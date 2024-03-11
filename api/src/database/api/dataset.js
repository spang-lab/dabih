/* eslint-disable no-await-in-loop */
import { Op } from 'sequelize';
import { getModel } from './util.js';
import { log, generateMnemonic } from '../../util/index.js';
import { rsa } from '../../crypto/index.js';
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

async function find(ctx, options) {
  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');

  return Dataset.findAll({
    include: {
      model: Member,
      as: 'members',
      attributes: ['permission', 'sub'],
      paranoid: false,
    },
    where: options,
    paranoid: false,
  });
}

async function findUpload(ctx, sub) {
  const Dataset = getModel(ctx, 'Dataset');
  const incomplete = await Dataset.findOne({
    where: {
      createdBy: sub,
      hash: {
        [Op.is]: null,
      },
    },
  });
  if (!incomplete) {
    return null;
  }
  return incomplete.get({ plain: true });
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

async function listAccessible(ctx, sub) {
  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');

  const results = await Dataset.findAll({
    include: {
      model: Member,
      as: 'members',
      attributes: ['permission', 'sub'],
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
    });
  return datasets;
}

async function listOrphans(ctx) {
  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');

  const results = await Dataset.findAll({
    include: {
      required: false,
      model: Member,
      as: 'members',
      attributes: ['permission', 'sub'],
    },
    where: {
      hash: {
        [Op.not]: null,
      },
    },
    order: [['createdAt', 'DESC']],
  });
  const orphans = results.filter((dset) => {
    const readers = dset.members.filter(
      (m) => m.permission !== 'none',
    );
    return readers.length === 0;
  });
  return orphans;
}

async function create(ctx, properties) {
  const Dataset = getModel(ctx, 'Dataset');

  const maxTries = 3;
  for (let i = 0; i < maxTries; i += 1) {
    const mnemonic = generateMnemonic();
    const existing = await findMnemonic(ctx, mnemonic);
    if (!existing) {
      const newDataset = await Dataset.create({
        ...properties,
        mnemonic,
      });
      return newDataset.get({ plain: true });
    }
  }
  throw new Error('ID SPACE exhausted, this should never happen');
}

async function listMembers(ctx, mnemonic) {
  const Member = getModel(ctx, 'Member');

  const { id } = await fromMnemonic(ctx, mnemonic);
  const members = await Member.findAll({
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
    paranoid: false,
  });
  if (!entry) {
    return 'none';
  }
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

async function findChunk(ctx, mnemonic, hash) {
  const Chunk = getModel(ctx, 'Chunk');
  const dataset = await fromMnemonic(ctx, mnemonic);
  const result = await Chunk.findOne({
    where: {
      hash,
      datasetId: dataset.id,
    },
  });
  if (!result) {
    return null;
  }
  return result.get({ plain: true });
}

async function findDuplicate(ctx, sub, fileName, size, chunkHash) {
  const Dataset = getModel(ctx, 'Dataset');
  const result = await Dataset.findOne({
    where: {
      createdBy: sub,
      fileName,
      size,
      hash: {
        [Op.not]: null,
      },
    },
  });
  if (!result) {
    return null;
  }
  const { id, hash } = result.get({ plain: true });
  const Chunk = getModel(ctx, 'Chunk');
  const match = await Chunk.findOne({
    where: {
      start: 0,
      hash: chunkHash,
      datasetId: id,
    },
  });
  if (match) {
    return hash;
  }
  return null;
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
  })).sort((c1, c2) => c1.start - c2.start);
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
  const subs = members
    .filter((m) => m.permission !== 'none')
    .map((m) => m.sub);
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

async function listRecoveryKeys(ctx, mnemonic) {
  const PublicKey = getModel(ctx, 'PublicKey');
  const Key = getModel(ctx, 'Key');
  const dataset = await fromMnemonic(ctx, mnemonic);

  const results = await PublicKey.findAll({
    include: {
      model: Key,
      as: 'keys',
      attributes: [
        'id',
        'key',
        'datasetId',
        'createdAt',
      ],
      where: {
        datasetId: dataset.id,
      },
    },
    attributes: [
      'id',
      'hash',
      'data',
      'createdAt',
    ],
    where: {
      isRootKey: true,
    },
  });

  const keys = results.map((result) => {
    const [key] = result.keys;
    return {
      mnemonic,
      encryptedKey: key.key,
      publicKey: result.data,
      fingerprint: result.hash,
    };
  });
  return keys;
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
  return Dataset.update(properties, {
    where: {
      mnemonic,
    },
  });
}

export default {
  fromMnemonic,
  listAll,
  listIncomplete,
  listOrphans,
  find,
  findUpload,
  listAccessible,
  create,
  findDuplicate,
  addMember,
  listMembers,
  getMemberAccess,
  setMemberAccess,
  listRecoveryKeys,
  addKeys,
  dropKeys,
  destroyKeys,
  findKey,
  findChunk,
  addChunk,
  listChunks,
  updateChunk,
  destroy,
  remove,
  recover,
  update,
  ...search,
};
