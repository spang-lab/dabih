import initChunk from './chunk.js';
import initDataset from './dataset.js';
import initEvent from './event.js';
import initKey from './key.js';
import initMember from './member.js';
import initPublicKey from './publicKey.js';
import initToken from './token.js';

export default function init(sequelize) {
  const PublicKey = initPublicKey(sequelize);
  initToken(sequelize);

  const Dataset = initDataset(sequelize);
  const Chunk = initChunk(sequelize);
  Dataset.hasMany(Chunk, { as: 'chunks', foreignKey: 'datasetId' });

  const Member = initMember(sequelize);
  Dataset.hasMany(Member, { as: 'members', foreignKey: 'datasetId' });

  const Key = initKey(sequelize);
  Dataset.hasMany(Key, { as: 'keys', foreignKey: 'datasetId' });
  PublicKey.hasMany(Key, { as: 'keys', foreignKey: 'publicKeyId' });

  initEvent(sequelize);
}
