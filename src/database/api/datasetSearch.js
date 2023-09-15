import {
  Op, col, fn, where,
} from 'sequelize';
import { getModel, getDialect } from './util.js';

function getWhere(query) {
  if (!query) {
    return {
      hash: {
        [Op.not]: null,
      },
    };
  }
  const q = `%${query.toLowerCase()}%`;
  return {
    hash: {
      [Op.not]: null,
    },
    [Op.or]: [
      where(fn('LOWER', col('name')), Op.like, q),
      where(fn('LOWER', col('fileName')), Op.like, q),
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

const getOrder = (column = 'createdAt', direction = 'DESC', dialect = 'postgres') => {
  if (dialect === 'sqlite') {
    return [[col(`dataset.${column}`), direction, 'NULLS LAST']];
  }
  return [[col(column), direction, 'NULLS LAST']];
};

async function search(ctx, sub, options) {
  const {
    query, deleted, all, uploader, page, limit,
    column, direction,
  } = options;
  const dialect = getDialect(ctx);

  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');
  const paranoid = !deleted;
  const order = getOrder(column, direction, dialect);

  const mWhere = all ? {} : { sub };
  const offset = (page - 1) * limit;

  const dWhere = getWhere(query);

  if (uploader) {
    dWhere.createdBy = sub;
  }
  const count = await Dataset.count({
    include: {
      model: Member,
      as: 'members',
      attributes: ['permission', 'sub'],
      paranoid,
      where: mWhere,
    },
    where: dWhere,
    paranoid,
  });

  const datasetIds = (await Dataset.findAll({
    include: {
      model: Member,
      as: 'members',
      attributes: ['permission', 'sub'],
      paranoid,
      where: mWhere,
    },
    where: dWhere,
    paranoid,
    order,
    limit,
    offset,
  })).map((d) => d.id);

  const datasets = await Dataset.findAll({
    include: {
      model: Member,
      as: 'members',
      attributes: ['permission', 'sub'],
      paranoid,
    },
    where: {
      id: datasetIds,
    },
    paranoid,
    order,
  });

  return {
    count,
    datasets,
  };
}

export default {
  search,
};
