
import { UnfinishedUpload, User } from "../types";
import db from "#lib/db";
import { readKey } from "#lib/keyv";

export default async function unfinished(user: User) {
  const { sub } = user;
  const unfinished = await db.dataset.findMany({
    where: {
      createdBy: sub,
      hash: null,
    },
    include: {
      chunks: {
        orderBy: {
          start: 'asc',
        }
      },
    }
  });
  const promises = unfinished.map(async (dataset) => {
    const { mnemonic } = dataset;
    const key = await readKey(sub, mnemonic);
    if (!key) {
      return null;
    }
    return dataset;
  });
  const results = (await Promise.all(promises))
    .filter((dataset) => dataset !== null) as UnfinishedUpload[];
  return results;
}
