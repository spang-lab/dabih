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

  const fields = [name, tag, mnemonic, data?.fileName, data?.uid, data?.hash]
    .map((field) => field?.toLowerCase())
    .filter((field) => field);

  if (fields.some((field) => field?.includes(query.toLowerCase()))) {
    return true;
  }
  return false;
}

function isDir(inode: InodeMembers) {
  return (
    InodeType.DIRECTORY === inode.type ||
    InodeType.TRASH === inode.type ||
    InodeType.HOME === inode.type
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
  const jsons = startPoints
    .filter((inode) => inodeMatchesQuery(inode, query))
    .map((inode) => toJson(inode));
  await job.addResults(jobId, jsons);
  const searched = new Set<bigint>();
  const searchQueue = startPoints.filter(isDir).map((inode) => inode.id);

  while (searchQueue.length > 0) {
    const meta = await job.getMeta(jobId);
    if (meta?.status !== 'running') {
      return;
    }

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
    const jsons = children
      .filter((inode) => inodeMatchesQuery(inode, query))
      .map((inode) => toJson(inode));
    await job.addResults(jobId, jsons);
    const newDirs = children.filter(isDir).map((inode) => inode.id);
    searchQueue.push(...newDirs.filter((id) => !searched.has(id)));
  }
  await job.complete(jobId);
  return;
}
