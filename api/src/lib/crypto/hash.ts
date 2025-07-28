import { createHash } from 'crypto';

const create = () => createHash('sha256');

const blob = async (data: Blob) => {
  const hash = create();
  const buffer = Buffer.from(await data.arrayBuffer());
  hash.update(buffer);
  return hash.digest('base64url');
};

const hash = {
  create,
  blob,
};
export default hash;
