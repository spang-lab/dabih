import db from "#lib/db";


export enum Permission {
  NONE = 0,
  READ = 1,
  WRITE = 2,
}

export const getMembers = async (mnemonic: string, hasPermission: Permission) => {
  const dataset = await db.dataset.findFirst({
    where: {
      mnemonic,
    },
    include: {
      members: {
        where: {
          permission: {
            gte: hasPermission,
          },
        }
      }
    }
  });
  if (!dataset) {
    throw new Error(`Dataset ${mnemonic} not found`);
  }
  return dataset.members;
}

export const getPermission = async (mnemonic: string, sub: string) => {
  const dataset = await db.dataset.findUnique({
    where: {
      mnemonic,
    },
    include: {
      members: {
        where: {
          sub,
        }
      }
    }
  });
  if (!dataset) {
    throw new Error(`Dataset ${mnemonic} not found`);
  }
  const member = dataset.members[0];
  return member?.permission as Permission || Permission.NONE;

}
