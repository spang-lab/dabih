import { Op } from 'sequelize';
import { getModel } from './util.js';

async function getWhere(query) {
  if (!query) {
    return {
      hash: {
        [Op.not]: null,
      },
    };
  }
  const q = `%${query}%`;
  dbg(q);
  return {
    [Op.or]: [
      {
        fileName: {
          [Op.like]: q,
        },
      },
      {
        mnemonic: {
          [Op.like]: q,
        },
      },
      {
        createdBy: {
          [Op.like]: q,
        },
      },
    ],
  };
}

async function search(ctx, sub, options) {
  const { query } = options;
  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');
  dbg(query);

  return Dataset.findAll({
    // include: {
    //   model: Member,
    //   as: 'members',
    //   attributes: ['permission', 'sub'],
    //   where: {
    //     sub,
    //   },
    // },
    where: getWhere(query),
    order: [
      ['createdAt', 'DESC'],
    ],
  });
}

export default {
  search,
};
