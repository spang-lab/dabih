/* eslint-disable no-param-reassign */
import { literal, Op } from 'sequelize';
import initDataset from './dataset.js';
import initEvent from './event.js';
import initPublicKey from './public-key.js';
import initToken from './token.js';
import initMember from './member.js';
import initChunk from './chunk.js';
import initKey from './key.js';

const addDefaultMethods = (model) => {
  model.updateTx = async (tx, props, where = {}) => model.update(props, {
    where,
    transaction: tx,
  });

  model.removeTx = async (tx, where = {}) => model.updateTx(tx, { deleted: literal('CURRENT_TIMESTAMP') }, where);
  model.recoverTx = async (tx, where = {}) => model.updateTx(tx, { deleted: null }, where);

  model.destroyTx = async (tx, where = {}) => model.destroy({
    where,
    transaction: tx,
  });

  model.findAllTx = async (tx, where = {}) => model.findAll({
    where: {
      ...where,
      deleted: {
        [Op.is]: null,
      },
    },
    raw: true,
    transaction: tx,
  });
  model.findOneTx = async (tx, where = {}) => model.findOne({
    where: {
      ...where,
      deleted: {
        [Op.is]: null,
      },
    },
    transaction: tx,
  });

  model.createTx = async (tx, obj) => model.create(obj, { transaction: tx });
};

const init = async (sequelize) => {
  const PublicKey = await initPublicKey(sequelize);
  addDefaultMethods(PublicKey);

  const Token = await initToken(sequelize);
  addDefaultMethods(Token);

  const Dataset = await initDataset(sequelize);
  addDefaultMethods(Dataset);
  const Chunk = await initChunk(sequelize);
  addDefaultMethods(Chunk);
  Dataset.hasMany(Chunk, { as: 'chunks', foreignKey: 'datasetId' });

  const Member = await initMember(sequelize);
  addDefaultMethods(Member);
  Dataset.hasMany(Member, { as: 'members', foreignKey: 'datasetId' });

  const Key = await initKey(sequelize);
  addDefaultMethods(Key);
  Dataset.hasMany(Key, { as: 'keys', foreignKey: 'datasetId' });
  PublicKey.hasMany(Key, { as: 'keys', foreignKey: 'publicKeyId' });

  const Event = await initEvent(sequelize);
  addDefaultMethods(Event);
};

export default init;
