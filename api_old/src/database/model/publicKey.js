import { DataTypes } from 'sequelize';

export default function init(sequelize) {
  const PublicKey = sequelize.define('PublicKey', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
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
    enabledBy: {
      type: DataTypes.STRING,
    },
    enabled: {
      type: DataTypes.DATE,
    },
  }, {
    paranoid: true,
    tableName: 'public_key',
  });
  return PublicKey;
}
