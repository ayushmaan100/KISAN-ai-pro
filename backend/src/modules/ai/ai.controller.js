import * as aiService from "./ai.service.js";

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