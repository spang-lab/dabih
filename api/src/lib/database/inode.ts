import db from "#lib/db";
import crypto from "#crypto";

import { NotFoundError, RequestError } from "src/api/errors";

export enum InodeType {
  FILE = 0,
  DIRECTORY = 1,
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



export const getFile = async (mnemonic: string) => {
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
      type: InodeType.FILE,
    },
    include: {
      data: true,
    },
  });
  if (!inode) {
    throw new NotFoundError(`No file found for mnemonic ${mnemonic}`);
  }
  if (inode.deletedAt) {
    throw new RequestError(`File ${mnemonic} has been deleted`);
  }
  const { data } = inode;
  if (!data) {
    throw new Error(`Inode ${mnemonic} has type FILE but no data`);
  }
  return {
    ...inode,
    data,
  };
};

export const getDirectory = async (mnemonic: string) => {
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
      type: InodeType.DIRECTORY,
    },
  });
  if (!inode) {
    throw new NotFoundError(`No directory found for mnemonic ${mnemonic}`);
  }
  return inode;
}



