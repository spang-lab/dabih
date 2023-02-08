import { DataTypes } from 'sequelize';

export default async function init(sequelize) {
  const Dataset = sequelize.define('Dataset', {
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
      type: DataTypes.INTEGER,
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
    deleted: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'dataset',
  });

  Dataset.fromMnemonic = async (tx, mnemonic) => {
    const result = await Dataset.findOne({
      where: { mnemonic },
      transaction: tx,
    });
    if (result === null) {
      throw new Error(`Dataset ${mnemonic} not found`);
    }
    return result;
  };
  return Dataset;
}
