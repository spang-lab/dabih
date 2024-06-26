
import { getFile } from "#lib/database/inode";
import { get } from "#lib/fs";


export default async function chunk(mnemonic: string, hash: string) {
  const file = await getFile(mnemonic);
  const { uid } = file.data;
  const stream = await get(uid, hash);
  return stream;
}
