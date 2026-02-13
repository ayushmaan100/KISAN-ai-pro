import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getMarketPrices = async (req, res) => {
  try {
    const { district } = req.query; // Optional filter

    const prices = await prisma.marketPrice.findMany({
      where: district ? { district: { contains: district, mode: 'insensitive' } } : {},
      orderBy: { price: 'desc' }
    });

    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch market rates" });
  }
};