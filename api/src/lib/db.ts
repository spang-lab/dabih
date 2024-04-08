import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const Permission = {
  NONE: 0,
  READ: 1,
  WRITE: 2,
};

export default prisma;
