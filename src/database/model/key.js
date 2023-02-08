import { DataTypes } from 'sequelize';

export default async function init(sequelize) {
  const Key = sequelize.define('Key', {
    key: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'key',
  });
  return Key;
}
