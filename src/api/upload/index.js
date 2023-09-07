import uploadStart from './start.js';
import uploadChunk from './chunk.js';
import uploadFinish from './finish.js';
import uploadCheck from './check.js';
import uploadCancel from './cancel.js';

export default {
  start: uploadStart,
  chunk: uploadChunk,
  finish: uploadFinish,
  check: uploadCheck,
  cancel: uploadCancel,
};
