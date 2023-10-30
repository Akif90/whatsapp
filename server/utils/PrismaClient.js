import {PrismaClient} from "@prisma/client";
let prismaInstance = null;

const generatePrismaClient = () => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
};

export default generatePrismaClient;
