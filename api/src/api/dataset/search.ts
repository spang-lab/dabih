
import { Permission } from "#lib/database/member";
import db from "#lib/db";
import { Prisma } from "@prisma/client";
import { SearchRequestBody, User } from "../types";




export default async function search(user: User, body: SearchRequestBody) {
  const { sub, isAdmin } = user;

  const { query, showDeleted, fileName, name, mnemonic, hash } = body;
  const showAll = body.showAll && isAdmin;

  const where = {
    OR: (query) ? [
      { fileName: { contains: query } },
      { name: { contains: query } },
      { mnemonic: { contains: query } },
    ] : undefined,
    fileName: fileName ? { contains: fileName } : undefined,
    name: name ? { contains: name } : undefined,
    mnemonic: mnemonic ? { contains: mnemonic } : undefined,
    hash: hash ? { contains: hash } : undefined,
    deletedAt: showDeleted ? undefined : null,
    members: showAll ? undefined : {
      some: {
        sub,
        permission: {
          not: Permission.NONE,
        }
      }
    }
  };
  const count = await db.dataset.count({
    where,
  });

  const dir = body.sortDir ?? Prisma.SortOrder.desc;
  const sort = body.sortBy ?? 'createdAt';

  const datasets = await db.dataset.findMany({
    where,
    take: body.take,
    skip: body.skip,
    orderBy: {
      [sort]: dir,
    },
    include: {
      members: true,
    },
  });
  return {
    count,
    datasets,
  }
}
