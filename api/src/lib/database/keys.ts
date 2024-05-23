
import db from "#lib/db";
import { Permission, getMembers } from "./member";
import crypto from "#crypto";


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

  const dataset = await db.dataset.findFirst({
    where: {
      mnemonic,
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
  if (!dataset) {
    throw new Error(`Dataset ${mnemonic} not found`);
  }
  const existingHashes = new Set(dataset.keys.map(k => k.publicKeyHash));
  const missing = publicKeys.filter(p => !existingHashes.has(p.hash));
  return missing;
}

export const getSurplusKeys = async (mnemonic: string) => {
  const publicKeys = await getPublicKeys(mnemonic);

  const dataset = await db.dataset.findFirst({
    where: {
      mnemonic,
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
  if (!dataset) {
    throw new Error(`Dataset ${mnemonic} not found`);
  }
  return dataset.keys;
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
  await db.dataset.update({
    where: {
      mnemonic,
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
  await db.dataset.update({
    where: {
      mnemonic,
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
