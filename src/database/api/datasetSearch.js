import { Op, col } from 'sequelize';
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

const getOrder = (column, direction) => {
  if (!column || !direction) {
    return [[col('dataset.createdAt'), 'DESC']];
  }
  const dcolumn = `dataset.${column}`;

  return [[col(dcolumn), direction]];
};

async function search(ctx, sub, options) {
  const {
    query, deleted, all, uploader, page, limit,
    column, direction,
  } = options;
  const Dataset = getModel(ctx, 'Dataset');
  const Member = getModel(ctx, 'Member');
  const paranoid = !deleted;
  const order = getOrder(column, direction);

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
  });

  const datasetIds = (await Dataset.findAll({
    include: {
      model: Member,
      as: 'members',
      attributes: ['permission', 'sub'],
      paranoid,
      where: mWhere,
    },
    where,
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
