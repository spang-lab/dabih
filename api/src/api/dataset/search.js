import { dataset } from '../../database/index.js';

const route = async (ctx) => {
  const { sub, isAdmin } = ctx.data;

  const addPermission = (d) => {
    const dset = d.get({ plain: true });
    const permission = dset.members.reduce((p, member) => {
      if (member.sub === sub) {
        return member.permission;
      }
      return p;
    }, 'none');
    return {
      ...dset,
      permission,
    };
  };

  const { body } = ctx.request;

  const {
    query, uploader, deleted, all,
    page, limit, column, direction,
  } = body;

  let options = {
    query,
    uploader,
    page,
    limit,
    column,
    direction,
  };
  if (isAdmin) {
    options = {
      ...options,
      deleted,
      all,
    };
  }
  const { count, datasets } = await dataset.search(ctx, sub, options);
  const full = datasets.map(addPermission);
  ctx.body = {
    count,
    datasets: full,
  };
};
export default route;
