import { createHash } from 'crypto';

const create = () => createHash('sha256');

const buffer = (data: Buffer) => {
  const hash = create();
  hash.update(data);
  return hash.digest('base64url');
};

const blob = async (data: Blob) => {
  const buf = Buffer.from(await data.arrayBuffer());
  return buffer(buf);
};

const hash = {
  create,
  buffer,
  blob,
};
export default hash;
