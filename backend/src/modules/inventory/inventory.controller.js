import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getInventory = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await prisma.inventory.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

export const addItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, category, quantity, unit } = req.body;

    const item = await prisma.inventory.create({
      data: {
        userId,
        name,
        category,
        quantity: parseFloat(quantity),
        unit
      }
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: "Failed to add item" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Ensure ownership before deleting
    const item = await prisma.inventory.findFirst({ where: { id, userId } });
    if (!item) return res.status(404).json({ error: "Item not found" });

    await prisma.inventory.delete({ where: { id } });
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
};