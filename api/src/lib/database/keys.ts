
import dbg from "#util/dbg";
import { readKey } from "#lib/keyv";


export const generateKeys = async (mnemonic: string) => {
  const aesKey = await readKey(mnemonic);
  dbg(aesKey);

}
