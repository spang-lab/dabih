import uploadStart from './start.js';
import uploadChunk from './chunk.js';
import uploadFinish from './finish.js';

export default {
  start: uploadStart,
  chunk: uploadChunk,
  finish: uploadFinish,
};
