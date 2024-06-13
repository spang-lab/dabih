import { RequestError } from "../errors";


export const parseDigest = (digest: string) => {
  const regex = /^SHA-256=([\w-]+)={0,2}$/i;
  const match = digest.match(regex);
  if (!match) {
    throw new RequestError('Invalid digest header, needs to be "SHA-256={hash}"');
  }
  return match[1];
};


export const parseContentRange = (contentRange: string) => {
  const regex = /^bytes (\d+)-(\d+)\/(\d+|\*)$/;
  const match = contentRange.match(regex);
  if (!match) {
    throw new RequestError(`Invalid Content-Range header, needs to be "bytes {start}-{end}/{size | *}", got "${contentRange}"`);
  }
  const start = parseInt(match[1], 10);
  const end = parseInt(match[2], 10);
  if (start > end) {
    throw new RequestError('Invalid Content-Range header, start is greater than end');
  }
  if (match[3] === '*') {
    return { start, end };
  }
  const size = parseInt(match[3], 10);
  return { start, end, size };
};
