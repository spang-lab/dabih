import { initRedis } from '#lib/redis';
import dbg from '#lib/dbg';
import { InodeSearchBody, InodeMembers, InodeType, User } from 'src/api/types';
import job from '#lib/redis/job';
import db from '#lib/db';
import { convertBigInts } from 'src/middleware/serialize';

async function initalize() {
  await initRedis();
}

export default initalize();

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

export async function search({
  user,
  body,
  jobId,
}: {
  user: User;
  body: InodeSearchBody;
  jobId: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // return inodes where the sub is in the members
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
  console.log(startPoints);
  await job.addResults(
    jobId,
    startPoints.map((inode) => JSON.stringify(inode, convertBigInts)),
  );

  await job.complete(jobId);
  dbg(user, body, jobId);

  return;
}
