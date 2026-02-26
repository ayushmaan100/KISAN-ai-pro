import { PrismaClient } from "@prisma/client";
import * as aiService from "./ai.service.js";

const prisma = new PrismaClient();
export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const result = await aiService.analyzeCropImage(
      req.file.path,
      req.file.mimetype
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCropRecommendations = async (req, res) => {
  try {
    const { farmId } = req.params;
    const userId = req.user.id;

    // 1. Fetch Farm Details
    const farm = await prisma.farm.findUnique({
      where: { id: farmId }
    });

    if (!farm || farm.userId !== userId) {
      return res.status(404).json({ error: "Farm not found" });
    }

    // 2. Ask Gemini for Recommendations
    const recommendations = await aiService.recommendCrops(farm);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};