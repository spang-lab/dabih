import { DataTypes } from 'sequelize';

export default function init(sequelize) {
  const Token = sequelize.define(
    'Token',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      value: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      sub: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      scope: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          const str = this.getDataValue('scope') || '';
          return str.split(' ');
        },
        set(value) {
          const str = value.join(' ');
          this.setDataValue('scope', str);
        },
      },
      exp: {
        type: DataTypes.DATE,
      },
    },
    {
      paranoid: false,
      tableName: 'token',
    },
  );
  return Token;
}
