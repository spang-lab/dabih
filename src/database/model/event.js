import {
  DataTypes, NOW, literal, fn, col,
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
    deleted: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'event',
  });
  Event.listDates = (tx) => Event.findAll(
    {
      attributes: [[fn('DISTINCT', col('day')), 'day']],
      order: [['day', 'DESC']],
      transaction: tx,
    },
  );

  return Event;
}
