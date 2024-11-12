import { initRedis } from '#lib/redis';
import { InodeSearchBody, InodeMembers, InodeType, User } from 'src/api/types';
import job from '#lib/redis/job';
import db from '#lib/db';
import { convertBigInts } from 'src/middleware/serialize';

async function initalize() {
  await initRedis();
}

export default initalize();

function toJson(inode: InodeMembers) {
  return JSON.stringify(inode, convertBigInts);
}

function inodeMatchesQuery(inode: InodeMembers, query: string) {
  const { name, tag, mnemonic, data } = inode;
  return (
    name.includes(query) ??
    tag?.includes(query) ??
    mnemonic.includes(query) ??
    data?.fileName.includes(query) ??
    data?.uid.includes(query) ??
    data?.hash?.includes(query)
  );
}

function isDir(inode: InodeMembers) {
  return [InodeType.DIRECTORY, InodeType.TRASH, InodeType.HOME].includes(
    inode.type,
  );
}

export async function search({
  user,
  body,
  jobId,
}: {
  user: User;
  body: InodeSearchBody;
  jobId: string;
}) {
  const { query } = body;

  const startPoints = await db.inode.findMany({
    where: {
      members: {
        some: {
          sub: user.sub,
        },
      },
    },
    include: {
      members: true,
      data: true,
    },
  });
  const promises = startPoints
    .filter((inode) => inodeMatchesQuery(inode, query))
    .map((inode) => job.addResult(jobId, toJson(inode)));
  await Promise.all(promises);
  const searched = new Set<bigint>();
  const searchQueue = startPoints.filter(isDir).map((inode) => inode.id);

  while (searchQueue.length > 0) {
    const inodeId = searchQueue.shift()!;
    searched.add(inodeId);
    const children = await db.inode.findMany({
      where: {
        parentId: inodeId,
      },
      include: {
        members: true,
        data: true,
      },
    });
    const promises = children
      .filter((inode) => inodeMatchesQuery(inode, query))
      .map((inode) => job.addResult(jobId, toJson(inode)));
    await Promise.all(promises);
    const newDirs = children.filter(isDir).map((inode) => inode.id);
    searchQueue.push(...newDirs.filter((id) => !searched.has(id)));
  }
  await job.complete(jobId);
  return;
}
