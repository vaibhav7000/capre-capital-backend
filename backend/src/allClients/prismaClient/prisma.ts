import { PrismaClient } from '../../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const getPrisma = (database_url: string) => {
  const prisma = new PrismaClient({
    datasourceUrl: database_url,
  }).$extends(withAccelerate())
  return prisma
}

export default getPrisma;

