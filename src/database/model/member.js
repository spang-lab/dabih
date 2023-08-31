import { DataTypes } from 'sequelize';

const permissions = ['none', 'read', 'write'];

function permissionIndex(p) {
  const perm = p.toLowerCase();
  const idx = permissions.indexOf(perm);
  if (idx === -1) {
    throw new Error(`Invalid required Permission, must be one of [${permissions.join(', ')}]`);
  }
  return idx;
}

function permission(idx) {
  if (idx < 0 || idx >= permissions.length) {
    throw new Error(`Invalid permission idx, must be between 0 and ${permissions.length}`);
  }
  return permissions[idx];
}

export default async function init(sequelize) {
  const Member = sequelize.define('Member', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    sub: {
      type: DataTypes.TEXT,
    },
    permission: {
      type: DataTypes.INTEGER,
      get() {
        const idx = this.getDataValue('permission');
        return permission(idx);
      },
      set(value) {
        const idx = permissionIndex(value);
        this.setDataValue('permission', idx);
      },
    },
  }, {
    paranoid: true,
    tableName: 'member',
  });
  Member.permissionIndex = permissionIndex;
  Member.permission = permission;

  return Member;
}
