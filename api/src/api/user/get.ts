import db from "#lib/db";

export default async function get(sub: string) {
  return await db.user.findUnique({
    where: {
      sub,
    },
    include: {
      keys: true,
    }
  });
}

