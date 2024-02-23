import { dataset } from '../../database/index.js';
import { getSub, userHasScope } from '../../util/index.js';

const route = async (ctx) => {
  const sub = getSub(ctx);
  const isAdmin = userHasScope(ctx, 'admin');

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

  const results = await dataset.find(ctx, body);
  const full = results.map(addPermission);

  if (isAdmin) {
    ctx.body = full;
    return;
  }
  const accessible = full.filter((d) => d.permission !== 'none');
  ctx.body = accessible;
};
export default route;
