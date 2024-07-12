import db from '#lib/db';
import crypto from '#crypto';
import { File, Inode, InodeMembers, InodeTree, InodeType } from 'src/api/types';

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
  throw new Error('Failed to generate unique uid');
};

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
  throw new Error('Failed to generate unique mnemonic');
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
  const promises = inode.children.map((child) => listFiles(child.mnemonic));
  const childLists = await Promise.all(promises);
  return childLists.flat();
};

const getInodesRecursive = async (inode: InodeTree): Promise<InodeTree> => {
  const children = await db.inode.findMany({
    where: {
      parentId: inode.id,
    },
    include: {
      data: true,
      members: true,
      keys: true,
    },
  });
  const childrenPromises = children.map(async (child) =>
    getInodesRecursive(child),
  );
  const newChildren = await Promise.all(childrenPromises);
  return {
    ...inode,
    children: newChildren.length > 0 ? newChildren : undefined,
  };
};

export const listTree = async (mnemonic: string) => {
  const root = await db.inode.findUnique({
    where: {
      mnemonic,
    },
    include: {
      data: true,
      members: true,
      keys: true,
    },
  });
  if (!root) {
    throw new Error(`Inode ${mnemonic} not found`);
  }
  return getInodesRecursive(root);
};
