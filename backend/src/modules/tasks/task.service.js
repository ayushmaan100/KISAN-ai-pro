import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTasksByUser = async (userId) => {
  // Find all farms belonging to user, then get their active seasons' tasks
  const tasks = await prisma.task.findMany({
    where: {
      season: {
        farm: {
          userId: userId
        },
        status: 'ACTIVE'
      }
    },
    include: {
      season: {
        include: {
          farm: true // To show which farm this task belongs to
        }
      }
    },
    orderBy: {
      dueDate: 'asc' // Show urgent tasks first
    }
  });
  return tasks;
};

export const updateTaskStatus = async (taskId, userId, isCompleted) => {
  // 1. Verify ownership
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { season: { include: { farm: true } } }
  });

  if (!task || task.season.farm.userId !== userId) {
    throw new Error("Access denied or task not found");
  }

  // 2. Update status
  return prisma.task.update({
    where: { id: taskId },
    data: { isCompleted }
  });
};