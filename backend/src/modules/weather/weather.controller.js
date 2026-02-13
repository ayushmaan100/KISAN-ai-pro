import * as weatherService from './weather.service.js';

export const getWeather = async (req, res) => {
  try {
    const { district } = req.params;
    if (!district) return res.status(400).json({ error: "District is required" });

    const weather = await weatherService.getCurrentWeather(district);
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
