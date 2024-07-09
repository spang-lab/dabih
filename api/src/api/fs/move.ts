import { MoveInodeBody, User } from "../types";
import { AuthorizationError, RequestError } from "../errors";
import { getMembers, getPermission, Permission } from "#lib/database/member";
import { InodeType } from "#lib/database/inode";


export default async function move(user: User, body: MoveInodeBody) {
  const { sub, isAdmin } = user;
  const { mnemonic } = body;
  if (!isAdmin) {
    const permission = await getPermission(mnemonic, sub);
    if (permission !== Permission.WRITE) {
      throw new AuthorizationError(`Not authorized to move ${mnemonic}`);
    }
  }

  if (body.parent) {
    const inode = await getMembers(body.parent, Permission.READ);
    if (inode.type as InodeType !== InodeType.DIRECTORY) {
      throw new RequestError(`Parent ${body.parent} is not a directory`);
    }
    console.log(inode);

  }
  throw new RequestError(`Not implemented`);
}
