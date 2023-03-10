import { DataTypes } from 'sequelize';

export default async function init(sequelize) {
  const Token = sequelize.define('Token', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    scopes: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const str = this.getDataValue('scopes') || '';
        return str.split(' ');
      },
      set(value) {
        const str = value.join(' ');
        this.setDataValue('scopes', str);
      },
    },
    lifetime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'token',
  });
  return Token;
}
