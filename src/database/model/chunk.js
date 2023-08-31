import { DataTypes } from 'sequelize';

export default async function init(sequelize) {
  const Chunk = sequelize.define('Chunk', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    end: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    crc: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'chunk',
    paranoid: true,
  });
  return Chunk;
}
