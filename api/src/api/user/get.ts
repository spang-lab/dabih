import db from "#lib/db";

export default async function get(sub: string) {
  const result = await db.user.findUnique({
    where: {
      sub,
    },
    include: {
      keys: true,
    }
  });
  return result;
}

