import { Transform } from 'node:stream';
import crc32 from 'crc/calculators/crc32';



export default {
  createStream: () => new Crc32(),
};
