import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFarm = async (userId, data) => {
  return prisma.farm.create({
    data: {
      userId,
      name: data.name,
      district: data.district,
      state: data.state,
      landSize: parseFloat(data.landSize), // Ensure it's a number
      soilType: data.soilType,
      irrigationType: data.irrigationType,
    },
  });
};

export const getFarmsByUser = async (userId) => {
  return prisma.farm.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      seasons: {
        where: { status: 'ACTIVE' },
        take: 1
      }
    }
  });
};