import * as farmService from "./farm.service.js";

// API Handlers for Farm-related operations. 
// It checks for authentication (userId from req.user) and validates input before calling the service layer. It also handles errors gracefully and returns appropriate HTTP status codes and messages.
export const createFarm = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { name, district, state, landSize, soilType, irrigationType } = req.body;

    // Basic Validation
    if (!name || !district || !state || !landSize || !soilType || !irrigationType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const farm = await farmService.createFarm(userId, {
      name, district, state, landSize, soilType, irrigationType
    });
    
    res.status(201).json(farm);
  } catch (error) {
    console.error("Create Farm Error:", error);
    res.status(500).json({ error: "Failed to create farm" });
  }
};

export const getFarms = async (req, res) => {
  try {
    const userId = req.user.id;
    const farms = await farmService.getFarmsByUser(userId);
    res.json(farms);
  } catch (error) {
    console.error("Get Farms Error:", error);
    res.status(500).json({ error: "Failed to fetch farms" });
  }
};