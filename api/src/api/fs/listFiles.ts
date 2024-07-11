import { listKeys } from '#lib/database/keys';
import publicKey from '#lib/database/publicKey';
import { Permission, getPermission } from '#lib/database/member';
import { AuthorizationError } from '../errors';
import { User } from '../types';

export default async function listFiles(user: User, mnemonic: string) {
  const { sub, isAdmin } = user;
  if (!isAdmin) {
    const permission = await getPermission(mnemonic, sub);
    if (permission === Permission.NONE) {
      throw new AuthorizationError(`Not authorized to list ${mnemonic}`);
    }
  }
  let publicKeys = await publicKey.listUser(sub);
  if (isAdmin) {
    const rootKeys = await publicKey.listRoot();
    publicKeys = publicKeys.concat(rootKeys);
  }
  const hashes = publicKeys.map((k) => k.hash);
  const files = await listKeys(mnemonic, hashes);
  return files;
}
