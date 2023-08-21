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
    query, deleted, all, uploader, page, limit,
  } = options;
  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');
  const paranoid = !deleted;

  const mWhere = all ? {} : { sub };
  const offset = (page - 1) * limit;

  const where = getWhere(query);
  if (uploader) {
    where.createdBy = sub;
  }
  const count = await Dataset.count({
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

  const datasets = await Dataset.findAll({
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
    limit,
    offset,
  });
  return {
    count,
    datasets,
  };
}

export default {
  search,
};
