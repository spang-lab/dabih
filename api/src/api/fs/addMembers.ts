import { Permission, getMembers } from "#lib/database/member";

import { MemberAddBody, User } from "../types";
import { AuthorizationError, RequestError } from "../errors";
import crypto from "#lib/crypto/index";
import { listKeys } from "#lib/database/keys";
import db from "#lib/db";


export default async function addMembers(user: User, mnemonic: string, body: MemberAddBody) {
  const inode = await getMembers(mnemonic, Permission.NONE);
  const { members } = inode;
  const permission = members.find((m) => m.sub === user.sub)?.permission;
  if (permission !== Permission.WRITE) {
    throw new AuthorizationError(`User ${user.sub} does not have permission to add members to dataset ${mnemonic}`);
  }
  const { subs, keys } = body;
  const hashedKeys = keys.map((k) => ({
    ...k,
    hash: crypto.aesKey.toHash(k.key),
  }));
  const users = await db.user.findMany({
    where: {
      sub: {
        in: subs,
      },
    },
    include: {
      keys: {
        where: {
          enabled: {
            not: null,
          }
        }
      },
    },
  });
  if (users.length !== subs.length) {
    const missing = subs.filter((sub) => !users.find((u) => u.sub === sub));
    throw new RequestError(`Some users were not found, missing: ${missing.join(", ")}`);
  }

  const publicKeys = users.map((u) => u.keys).flat();
  const hashes = publicKeys.map((k) => k.hash);
  const files = await listKeys(mnemonic, hashes);

  const decryptableFiles = files.map((file) => {
    const { data, mnemonic } = file;
    const decryptionKey = hashedKeys.find((k) => k.mnemonic === mnemonic);
    if (!decryptionKey) {
      throw new RequestError(`No decryption key provided for file ${mnemonic}`);
    }
    if (decryptionKey.hash !== data.keyHash) {
      throw new RequestError(`Decryption key provided for file ${mnemonic} does not match`);
    }
    return {
      ...file,
      aesKey: decryptionKey.key,
    };
  });

  const promises = decryptableFiles.map(async (file) => {
    const { aesKey, data } = file;
    const keys = publicKeys
      .filter((publicKey) => !data.keys.find(k => k.hash === publicKey.hash))
      .map((publicKey) => {
        const pubKey = crypto.publicKey.fromString(publicKey.data);
        const encrypted = crypto.publicKey.encrypt(pubKey, aesKey);
        return {
          hash: publicKey.hash,
          key: encrypted,
        };
      });
    await db.fileData.update({
      where: {
        uid: data.uid,
      },
      data: {
        keys: {
          createMany: {
            data: keys,
          },
        },
      },
      include: {
        keys: true,
      },
    });
  });
  await Promise.all(promises);

  const newUsers = subs.filter((sub) => !members.find((m) => m.sub === sub)).map((sub) => ({
    sub,
    permission: Permission.READ,
  }));
  await db.inode.update({
    where: {
      id: inode.id,
    },
    data: {
      members: {
        createMany: {
          data: newUsers,
        },
      },
    },
  });
}
