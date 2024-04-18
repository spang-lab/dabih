import { User } from "../types";
import db from "#lib/db";
import { AuthorizationError, RequestError } from "../errors";
import { Permission } from "#lib/database/member";


export default async function get(user: User, mnemonic: string) {

  const { sub } = user;

  const result = await db.user.findUnique({
    where: { sub },
    include: {
      keys: {
        where: {
          enabled: {
            not: null
          }
        }
      }
    }
  });
  if (!result) {
    throw new RequestError(`No keys found for user ${sub}`);
  }
  const hashes = result.keys.map(k => k.hash);

  const dataset = await db.dataset.findUnique({
    where: {
      mnemonic,
      deletedAt: null,
    },
    include: {
      members: true,
      chunks: true,
      keys: {
        where: {
          publicKeyHash: {
            in: hashes
          }
        }
      }
    }
  });
  if (!dataset) {
    throw new RequestError(`Dataset ${mnemonic} does not exist, or was deleted`);
  }
  const member = dataset.members.find(m => m.sub === sub);
  const permission = member?.permission as Permission ?? Permission.NONE;
  if (permission === Permission.NONE) {
    throw new AuthorizationError(`User ${sub} does not have permission to access dataset ${mnemonic}`);
  }

  return dataset;
}

