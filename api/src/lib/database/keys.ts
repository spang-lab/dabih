
import db from "#lib/db";
import { Permission, getMembers } from "./member";
import crypto from "#crypto";
import { InodeType } from "./inode";
import { FileDecryptionKey, FileKeys, PublicKey } from "src/api/types";
import { RequestError } from "src/api/errors";


export const getUserKeys = async (sub: string) => {
  const result = await db.user.findUnique({
    where: {
      sub
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
  const keys = result?.keys ?? [];
  const rootKeys = await db.publicKey.findMany({
    where: {
      enabled: {
        not: null
      },
      isRootKey: true
    }
  });
  return keys.concat(rootKeys);
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

export const listKeys = async (mnemonic: string, hashes: string[] | null): Promise<FileKeys[]> => {
  const where = (hashes) ? {
    hash: {
      in: hashes,
    }
  } : {};

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
            where,
          },
        },
      },
    },
  });
  if (!inode) {
    return [];
  }
  const type = inode.type as InodeType;
  if (type === InodeType.FILE || type === InodeType.UPLOAD) {
    return [inode as FileKeys];
  }
  const promises = inode.children.map(child => listKeys(child.mnemonic, hashes));
  const childLists = await Promise.all(promises);
  return childLists.flat();
}

export const addKeys = async (mnemonic: string, decryptionKeys: FileDecryptionKey[], publicKeys: PublicKey[]) => {
  const hashedKeys = decryptionKeys.map((k) => ({
    ...k,
    hash: crypto.aesKey.toHash(k.key),
  }));
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
}

export const removeKeys = async (mnemonic: string) => {
  const files = await listKeys(mnemonic, null);




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
