import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper: Add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const createSeason = async (userId, data) => {
  const { farmId, crop, sowingDate } = data;

  // 1. Verify Farm belongs to User
  const farm = await prisma.farm.findUnique({
    where: { id: farmId },
  });

  if (!farm || farm.userId !== userId) {
    throw new Error("Access denied: Farm not found or not yours");
  }

  // 2. Create the Season
  const season = await prisma.season.create({
    data: {
      farmId,
      crop,
      sowingDate: new Date(sowingDate),
      status: "ACTIVE",
    },
  });

  // 3. Generate Smart Tasks based on Crop
  // (In a real app, this would come from a database of scientific schedules)
  const tasks = [];
  const start = new Date(sowingDate);

  if (crop.toLowerCase() === "wheat") {
    tasks.push({
      seasonId: season.id,
      title: "Sowing & Basal Fertilizer",
      description: "Sow seeds at 4-5cm depth. Apply DAP and Potash.",
      dueDate: start,
    });
    tasks.push({
      seasonId: season.id,
      title: "CRI Stage Irrigation",
      description: "Critical Root Initiation. Irrigate immediately (20-25 days).",
      dueDate: addDays(start, 21),
    });
    tasks.push({
      seasonId: season.id,
      title: "Weed Management",
      description: "Inspect for weeds and apply herbicide if necessary.",
      dueDate: addDays(start, 30),
    });
    tasks.push({
      seasonId: season.id,
      title: "Tillering Stage Irrigation",
      description: "Apply second irrigation during tillering.",
      dueDate: addDays(start, 45),
    });
  } else if (crop.toLowerCase() === "rice" || crop.toLowerCase() === "paddy") {
    tasks.push({
      seasonId: season.id,
      title: "Nursery Preparation",
      description: "Prepare seedbed and sow seeds.",
      dueDate: start,
    });
    tasks.push({
      seasonId: season.id,
      title: "Transplanting",
      description: "Transplant seedlings to main field.",
      dueDate: addDays(start, 25),
    });
  } else {
    // Default Tasks for other crops
    tasks.push({
      seasonId: season.id,
      title: "Sowing",
      description: `Sowing of ${crop}`,
      dueDate: start,
    });
    tasks.push({
      seasonId: season.id,
      title: "General Observation",
      description: "Check for pests and germination.",
      dueDate: addDays(start, 10),
    });
  }

  // 4. Bulk Insert Tasks
  if (tasks.length > 0) {
    await prisma.task.createMany({ data: tasks });
  }

  return season;
};

export const getSeasonsByFarm = async (userId, farmId) => {
  // Verify ownership
  const farm = await prisma.farm.findUnique({ where: { id: farmId } });
  if (!farm || farm.userId !== userId) throw new Error("Access denied");

  return prisma.season.findMany({
    where: { farmId },
    include: { tasks: true }, // Include the generated tasks
    orderBy: { sowingDate: "desc" },
  });
};