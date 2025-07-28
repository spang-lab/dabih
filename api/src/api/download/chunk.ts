
import { get } from "#lib/fs";

export default async function chunk(uid: string, hash: string) {
  const stream = await get(uid, hash);
  return stream;
}
