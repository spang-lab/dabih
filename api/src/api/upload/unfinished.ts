
import { UnfinishedUpload, User } from "../types";
import db from "#lib/db";
import { readKey } from "#lib/keyv";

export default async function unfinished(user: User) {
  const { sub } = user;
  const unfinished = await db.fileData.findMany({
    where: {
      createdBy: sub,
      hash: null,
    },
    include: {
      inodes: true,
      chunks: {
        orderBy: {
          start: 'asc',
        }
      },
    }
  });
  const promises = unfinished.map(async (fileData) => {
    const { inodes } = fileData;
    if (inodes.length === 0) {
      throw new Error(`FileData ${fileData.uid} has no inodes`);
    }
    if (inodes.length > 1) {
      throw new Error(`FileData ${fileData.uid} has more than one inode`);
    }
    const [inode] = inodes;
    const { mnemonic } = inode;
    const key = await readKey(sub, mnemonic);
    if (!key) {
      return null;
    }
    return {
      ...inode,
      fileData,
    };
  });
  const results = (await Promise.all(promises))
    .filter((dataset) => dataset !== null) as UnfinishedUpload[];
  return results;
}
