import { Permission, parsePermission } from "#lib/database/member";
import { SetAccessBody, User } from "../types";

import { AuthorizationError, RequestError } from "../errors";
import db from "#lib/db";

export default async function setAccess(user: User, mnemonic: string, body: SetAccessBody) {
  const dataset = await db.dataset.findUnique({
    where: {
      mnemonic,
      deletedAt: null,
    },
    include: {
      members: true,
    },
  });
  if (!dataset) {
    throw new RequestError(`Dataset ${mnemonic} not found`);
  }
  const { members } = dataset;
  const permission = members.find((m) => m.sub === user.sub)?.permission;
  if (permission !== Permission.WRITE && !user.isAdmin) {
    throw new AuthorizationError(`User ${user.sub} does not have permission to add members to dataset ${mnemonic}`);
  }

  const { sub } = body;
  const newPermission = parsePermission(body.permission);
  const oldPermission = members.find((m) => m.sub === sub)?.permission;
  if (oldPermission !== Permission.WRITE && oldPermission !== Permission.READ) {
    throw new RequestError(`Can only set access if user ${sub} already has read or write permission to dataset ${mnemonic}`);
  }
  if (oldPermission === Permission.WRITE) {
    const writers = members.filter((m) => m.permission as Permission === Permission.WRITE);
    if (writers.length <= 1) {
      throw new RequestError(`User ${sub} is the last user with write permission to dataset ${mnemonic}. Refusing to remove write permission`);
    }
  }

  await db.dataset.update({
    where: {
      id: dataset.id,
    },
    data: {
      members: {
        update: {
          where: {
            sub_datasetId: {
              datasetId: dataset.id,
              sub,
            },
          },
          data: {
            permission: newPermission,
          },
        },
      },
    },
  });




}
