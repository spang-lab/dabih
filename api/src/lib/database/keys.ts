
import db from "#lib/db";
import { Permission, getMembers } from "./member";
import crypto from "#crypto";
import { InodeType } from "./inode";
import { FileKeys } from "src/api/types";


export const getUserKeys = async (sub: string) => {
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
  return result?.keys ?? [];
};


export const getPublicKeys = async (mnemonic: string) => {
  const { members } = await getMembers(mnemonic, Permission.READ);
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
  const file = await db.inode.findUnique({
    where: {
      mnemonic,
    },
    include: {
      data: {
        include: {
          keys: {
            where: {
              hash: {
                in: publicKeys.map(p => p.hash)
              }
            }
          }
        }
      },
    },
  });
  if (!file || !file.data) {
    throw new Error(`${mnemonic} not found`);
  }
  const { keys } = file.data;
  const existingHashes = new Set(keys.map(k => k.hash));
  const missing = publicKeys.filter(p => !existingHashes.has(p.hash));
  return missing;
}

export const getSurplusKeys = async (mnemonic: string) => {
  const publicKeys = await getPublicKeys(mnemonic);
  const file = await db.inode.findUnique({
    where: {
      mnemonic,
    },
    include: {
      data: {
        include: {
          keys: {
            where: {
              hash: {
                notIn: publicKeys.map(p => p.hash)
              }
            }
          }
        }
      },
    },
  });
  if (!file?.data) {
    throw new Error(`${mnemonic} not found`);
  }
  return file.data.keys;
}

export const listKeys = async (mnemonic: string, hashes: string[]): Promise<FileKeys[]> => {
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
      deletedAt: null,
    },
    include: {
      children: true,
      data: {
        include: {
          keys: {
            where: {
              hash: {
                in: hashes,
              },
            },
          },
        },
      },
    },
  });
  if (!inode) {
    return [];
  }
  const type = inode.type as InodeType;
  if (type === InodeType.UPLOAD) {
    return [];
  }
  if (type === InodeType.FILE) {
    return [inode as FileKeys];
  }
  const promises = inode.children.map(child => listKeys(child.mnemonic, hashes));
  const childLists = await Promise.all(promises);
  return childLists.flat();
}


export const addKeys = async (mnemonic: string, aesKey: string) => {
  const newKeys = await getMissingKeys(mnemonic);
  const keys = newKeys.map(publicKey => {
    const pubKey = crypto.publicKey.fromString(publicKey.data);
    const encrypted = crypto.publicKey.encrypt(pubKey, aesKey);
    return {
      hash: publicKey.hash,
      key: encrypted,
    };
  });
  await db.inode.update({
    where: {
      mnemonic,
    },
    data: {
      data: {
        update: {
          keys: {
            createMany: {
              data: keys
            }
          }
        }
      }
    },
    include: {
      data: {
        include: {
          keys: true
        }
      }
    }
  });
}

export const removeKeys = async (mnemonic: string) => {
  const surplusKeys = await getSurplusKeys(mnemonic);
  await db.inode.update({
    where: {
      mnemonic,
    },
    data: {
      data: {
        update: {
          keys: {
            deleteMany: {
              hash: {
                in: surplusKeys.map(k => k.hash)
              }
            }
          }
        }
      }
    },
    include: {
      data: {
        include: {
          keys: true
        }
      }
    }
  });
}
