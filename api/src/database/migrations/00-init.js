import { DataTypes } from 'sequelize';

const defaultColums = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
};

export async function up({ context: sequelize }) {
  const db = sequelize.getQueryInterface();

  db.createTable('public_key', {
    ...defaultColums,
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: DataTypes.TEXT,
    email: DataTypes.TEXT,
    sub: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRootKey: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    enabled: DataTypes.DATE,
    enabledBy: DataTypes.STRING,
  });

  db.createTable('dataset', {
    ...defaultColums,
    mnemonic: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: DataTypes.TEXT,
    fileName: DataTypes.TEXT,
    path: DataTypes.TEXT,
    hash: DataTypes.STRING,
    size: DataTypes.BIGINT,
    keyHash: DataTypes.STRING,
    createdBy: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    validatedAt: DataTypes.DATE,
  });
  db.addIndex('dataset', ['name']);
  db.addIndex('dataset', ['fileName']);
  db.addIndex('dataset', ['createdBy']);
  db.addIndex('dataset', ['hash']);

  db.createTable('chunk', {
    ...defaultColums,
    datasetId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'dataset',
        key: 'id',
      },
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
    crc: DataTypes.STRING,
  });

  db.createTable('member', {
    ...defaultColums,
    datasetId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'dataset',
        key: 'id',
      },
    },
    sub: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permission: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  db.addIndex('member', ['sub']);

  db.createTable('key', {
    ...defaultColums,
    datasetId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'dataset',
        key: 'id',
      },
    },
    publicKeyId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'public_key',
        key: 'id',
      },
    },
    key: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  db.createTable('token', {
    ...defaultColums,
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
    },
  });
}
export async function down({ context: sequelize }) {
  const db = sequelize.getQueryInterface();

  db.dropTable('token');
  db.dropTable('key');
  db.dropTable('member');
  db.dropTable('chunk');
  db.dropTable('dataset');
  db.dropTable('public_key');
}
