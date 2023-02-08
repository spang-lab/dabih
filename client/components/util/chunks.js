/* eslint-disable import/prefer-default-export */
export const areChunksComplete = (chunks) => {
  const n = chunks.length;
  let prevEnd = 0;
  for (let i = 0; i < n; i += 1) {
    const chunk = chunks[i];
    if (!chunk.data) {
      return false;
    }
    if (chunk.start !== prevEnd) {
      return false;
    }
    prevEnd = chunk.end;
    if (i === n - 1) {
      return chunk.end === chunk.size;
    }
  }
  return false;
};
