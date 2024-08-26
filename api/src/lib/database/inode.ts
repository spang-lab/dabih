import db from '#lib/db';
import crypto from '#crypto';
import { File, InodeTree, InodeType, Permission } from 'src/api/types';

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
      parentId: inode.id as bigint,
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

const isChildOfRecursive = async (inodeId: number | null, parentId: number) => {
  if (inodeId === null) {
    return false;
  }
  const inode = await db.inode.findUnique({
    where: {
      id: inodeId,
    },
  });
  if (!inode) {
    throw new Error(`Inode ${inodeId} not found`);
  }
  if (inode.parentId === parentId) {
    return true;
  }
  return isChildOfRecursive(inode.parentId, parentId);
};

export const isChildOf = async (mnemonic: string, parent: string) => {
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
    },
  });
  if (!inode) {
    throw new Error(`Inode ${mnemonic} not found`);
  }
  const parentInode = await db.inode.findUnique({
    where: {
      mnemonic: parent,
    },
  });
  if (!parentInode) {
    throw new Error(`Inode ${parent} not found`);
  }
  if (inode.parentId === parentInode.id) {
    return true;
  }
  return isChildOfRecursive(inode.parentId, parentInode.id);
};

export const getTrash = async (sub: string) => {
  const trash = await db.inode.findFirst({
    where: {
      type: InodeType.TRASH,
      parent: null,
      members: {
        some: {
          sub,
        },
      },
    },
    include: {
      members: true,
    },
  });
  if (trash) {
    return trash;
  }
  return db.inode.create({
    data: {
      mnemonic: await generateMnemonic(),
      name: 'Trash',
      type: InodeType.TRASH,
      members: {
        create: {
          sub,
          permission: Permission.READ,
        },
      },
    },
    include: {
      members: true,
    },
  });
};

export const createRoot = async () => {
  const root = await db.inode.findFirst({
    where: {
      type: InodeType.ROOT,
    },
  });
  if (root) {
    return root;
  }
  const newRoot = await db.inode.create({
    data: {
      mnemonic: await generateMnemonic(),
      name: '/',
      type: InodeType.ROOT,
    },
  });
  return newRoot;
};
