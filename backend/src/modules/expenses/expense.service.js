import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addExpense = async (userId, data) => {
  const { seasonId, category, amount, note } = data;

  // 1. Verify Season belongs to User (Security Check)
  const season = await prisma.season.findUnique({
    where: { id: seasonId },
    include: { farm: true }
  });

  if (!season || season.farm.userId !== userId) {
    throw new Error("Access denied: Season not found");
  }

  // 2. Create Expense
  return prisma.expense.create({
    data: {
      seasonId,
      category,
      amount: parseFloat(amount),
      note
    }
  });
};

export const getExpensesBySeason = async (userId, seasonId) => {
  // Verify access
  const season = await prisma.season.findUnique({
    where: { id: seasonId },
    include: { farm: true }
  });

  if (!season || season.farm.userId !== userId) {
    throw new Error("Access denied");
  }

  return prisma.expense.findMany({
    where: { seasonId },
    orderBy: { date: 'desc' }
  });
};