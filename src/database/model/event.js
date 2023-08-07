import {
  DataTypes, NOW,
} from 'sequelize';

export default async function init(sequelize) {
  const Event = sequelize.define('Event', {
    sub: {
      type: DataTypes.TEXT,
    },
    mnemonic: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    event: {
      type: DataTypes.TEXT,
    },
    message: {
      type: DataTypes.TEXT,
    },
    day: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: NOW,
    },
  }, {
    tableName: 'event',
  });

  return Event;
}
