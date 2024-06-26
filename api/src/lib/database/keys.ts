
import db from "#lib/db";
import { Permission, getMembers } from "./member";
import crypto from "#crypto";
import { getFile } from "./inode";


export const getPublicKeys = async (mnemonic: string) => {
  const members = await getMembers(mnemonic, Permission.READ);
  const users = await db.user.findMany({
    where: {
      sub: {
        in: members.map((member) => member.sub)
      }
    },
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
  const rootKeys = await db.publicKey.findMany({
    where: {
      enabled: {
        not: null
      },
      isRootKey: true
    }
  });
  const userKeys = users.map(u => u.keys).flat();
  return rootKeys.concat(userKeys);
}


export const getMissingKeys = async (mnemonic: string) => {
  const publicKeys = await getPublicKeys(mnemonic);
  const file = await getFile(mnemonic);
  const { uid } = file.data;
  const data = await db.fileData.findUnique({
    where: {
      uid,
    },
    include: {
      keys: {
        where: {
          publicKeyHash: {
            in: publicKeys.map(p => p.hash)
          }
        }
      }
    }
  });
  if (!data) {
    throw new Error(`Data ${uid} not found`);
  }
  const existingHashes = new Set(data.keys.map(k => k.publicKeyHash));
  const missing = publicKeys.filter(p => !existingHashes.has(p.hash));
  return missing;
}

export const getSurplusKeys = async (mnemonic: string) => {
  const publicKeys = await getPublicKeys(mnemonic);
  const file = await getFile(mnemonic);
  const { uid } = file.data;
  const data = await db.fileData.findUnique({
    where: {
      uid,
    },
    include: {
      keys: {
        where: {
          publicKeyHash: {
            notIn: publicKeys.map(p => p.hash)
          }
        }
      }
    }
  });
  if (!data) {
    throw new Error(`Data ${uid} not found`);
  }
  return data.keys;
}


export const addKeys = async (mnemonic: string, aesKey: string) => {
  const newKeys = await getMissingKeys(mnemonic);
  const keys = newKeys.map(publicKey => {
    const pubKey = crypto.publicKey.fromString(publicKey.data);
    const encrypted = crypto.publicKey.encrypt(pubKey, aesKey);
    return {
      publicKeyHash: publicKey.hash,
      key: encrypted,
    };
  });
  const file = await getFile(mnemonic);
  const { uid } = file.data;
  await db.fileData.update({
    where: {
      uid,
    },
    data: {
      keys: {
        createMany: {
          data: keys
        }
      }
    },
    include: {
      keys: true
    }
  });
}

export const removeKeys = async (mnemonic: string) => {
  const surplusKeys = await getSurplusKeys(mnemonic);
  const file = await getFile(mnemonic);
  const { uid } = file.data;
  await db.fileData.update({
    where: {
      uid,
    },
    data: {
      keys: {
        deleteMany: {
          publicKeyHash: {
            in: surplusKeys.map(k => k.publicKeyHash)
          }
        }
      }
    }
  });
}
