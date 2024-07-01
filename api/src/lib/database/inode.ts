import db from "#lib/db";
import crypto from "#crypto";
import { File } from "src/api/types";

export enum InodeType {
  FILE = 0,
  DIRECTORY = 1,
  UPLOAD = 2,
}

export const generateDataUid = async () => {
  const maxAttempts = 3;
  for (let i = 0; i < maxAttempts; i++) {
    const uid = await crypto.random.getToken(12);
    const existing = await db.fileData.findUnique({
      where: {
        uid,
      },
    });
    if (!existing) {
      return uid;
    }
  }
  throw new Error("Failed to generate unique uid");
}


export const generateMnemonic = async () => {
  const maxAttempts = 3;
  for (let i = 0; i < maxAttempts; i++) {
    const mnemonic = crypto.random.getMnemonic();
    const existing = await db.inode.findUnique({
      where: {
        mnemonic,
      },
    });
    if (!existing) {
      return mnemonic;
    }
  }
  throw new Error("Failed to generate unique mnemonic");
};

export const listFiles = async (mnemonic: string): Promise<File[]> => {
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
      deletedAt: null,
    },
    include: {
      children: true,
      data: true,
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
    return [inode as File];
  }
  const promises = inode.children.map(child => listFiles(child.mnemonic));
  const childLists = await Promise.all(promises);
  return childLists.flat();
}


