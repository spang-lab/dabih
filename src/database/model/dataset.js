import { DataTypes } from 'sequelize';

export default async function init(sequelize) {
  const Dataset = sequelize.define('Dataset', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    mnemonic: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
    },
    fileName: {
      type: DataTypes.TEXT,
    },
    hash: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.BIGINT,
    },
    keyHash: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    validated: {
      type: DataTypes.DATE,
    },
  }, {
    paranoid: true,
    tableName: 'dataset',
  });
  return Dataset;
}
