/* eslint-disable no-param-reassign */
import { literal, Op } from 'sequelize';

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
