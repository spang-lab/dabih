import { Permission } from "#lib/database/member";
import db from "#lib/db";

import { MemberAddBody, User } from "../types";
import { AuthorizationError, RequestError } from "../errors";
import crypto from "#lib/crypto/index";
import { addKeys } from "#lib/database/keys";

export default async function addMember(user: User, mnemonic: string, body: MemberAddBody) {
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
  const { sub, key } = body;
  const keyHash = crypto.aesKey.toHash(key);
  if (dataset.keyHash !== keyHash) {
    throw new RequestError(`Invalid key for dataset ${mnemonic}, hash mismatch ${dataset.keyHash} !== ${keyHash}`);
  }

  await db.dataset.update({
    where: {
      id: dataset.id,
    },
    data: {
      members: {
        upsert: {
          create: {
            sub,
            permission: Permission.READ,
          },
          update: {
            permission: Permission.READ,
          },
          where: {
            sub_datasetId: {
              datasetId: dataset.id,
              sub,
            },
          },
        },
      },
    },
    include: {
      members: true,
    },
  });
  await addKeys(mnemonic, key);
}
