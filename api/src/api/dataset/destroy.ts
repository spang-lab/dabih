import { getPermission, Permission } from "#lib/database/member";
import { User } from "../types";
import { AuthorizationError, RequestError } from "../errors";
import db from "#lib/db";
import { removeBucket } from "#lib/fs";

export default async function destroy(user: User, mnemonic: string, force: boolean) {
  const { sub, isAdmin } = user;
  const permission = await getPermission(mnemonic, sub);

  if (permission !== Permission.WRITE && !isAdmin) {
    throw new AuthorizationError(`User ${sub} does not have permission to destroy dataset ${mnemonic}`);
  }

  const dataset = await db.dataset.findUnique({
    where: {
      mnemonic,
    },
  });
  if (!dataset) {
    throw new RequestError(`Dataset ${mnemonic} does not exist`);
  }
  if (!dataset.deletedAt) {
    throw new RequestError(`Can only destroy ${mnemonic} if it was deleted first`);
  }

  const now = new Date();
  const diff = now.getTime() - dataset.deletedAt.getTime();
  const oneHour = 60 * 60 * 1000;
  if (diff < oneHour && !force) {
    throw new RequestError(
      `Dataset ${mnemonic} was deleted less than an hour ago, cannot destroy. Use "force: true" in the body to override`
    );
  }

  await db.dataset.update({
    where: {
      mnemonic,
    },
    data: {
      keys: {
        deleteMany: {},
      },
      chunks: {
        deleteMany: {},
      },
      members: {
        deleteMany: {},
      },
    },
    include: {
      keys: true,
      chunks: true,
      members: true,
    },
  });
  await db.dataset.delete({
    where: {
      mnemonic,
    },
  });
  await removeBucket(mnemonic);
}
