
import dbg from "#lib/util/dbg";

import { RequestWithUser } from '../types';

export default async function chunk(
  mnemonic: string,
  request: RequestWithUser,
) {
  dbg(request);
  throw new Error('Not implemented');
}
