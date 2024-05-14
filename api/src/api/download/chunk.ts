
import { get } from "#lib/fs";


export default async function chunk(mnemonic: string, hash: string) {
  const stream = await get(mnemonic, hash);
  return stream;
}
