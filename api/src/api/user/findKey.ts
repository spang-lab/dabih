import db from '#lib/db';

export default async function findKey(hash: string) {
  const result = await db.user.findFirst({
    where: {
      keys: {
        some: {
          hash,
        },
      },
    },
    include: {
      keys: true,
    },
  });
  return result;
}
