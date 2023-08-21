import { DataTypes } from 'sequelize';

export default async function init(sequelize) {
  const PublicKey = sequelize.define('PublicKey', {
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.TEXT,
    },
    sub: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    isRootKey: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    confirmedBy: {
      type: DataTypes.TEXT,
    },
    confirmed: {
      type: DataTypes.DATE,
    },
  }, {
    paranoid: true,
    tableName: 'public_key',
  });
  return PublicKey;
}
