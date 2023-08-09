import { Op } from 'sequelize';
import { getModel } from './util.js';

function getWhere(query) {
  if (!query) {
    return {
      hash: {
        [Op.not]: null,
      },
    };
  }
  const q = `%${query}%`;
  return {
    hash: {
      [Op.not]: null,
    },
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
        name: {
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
  const {
    query, deleted, all, uploader,
  } = options;
  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');
  const paranoid = !deleted;

  const mWhere = all ? {} : { sub };

  const where = getWhere(query);
  if (uploader) {
    where.createdBy = sub;
  }

  return Dataset.findAll({
    include: {
      model: Member,
      as: 'members',
      attributes: ['permission', 'sub'],
      paranoid,
      where: mWhere,
    },
    where,
    paranoid,
    order: [['createdAt', 'DESC']],
  });
}

export default {
  search,
};
