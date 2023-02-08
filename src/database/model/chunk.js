import { DataTypes } from 'sequelize';

export default async function init(sequelize) {
  const Chunk = sequelize.define('Chunk', {
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
    deleted: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'chunk',
  });
  return Chunk;
}
