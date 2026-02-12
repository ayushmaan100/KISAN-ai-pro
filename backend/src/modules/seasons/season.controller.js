import * as seasonService from "./season.service.js";

export const createSeason = async (req, res) => {
  try {
    const userId = req.user.id;
    // expect { farmId, crop, sowingDate }
    const season = await seasonService.createSeason(userId, req.body);
    res.status(201).json(season);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const getSeasons = async (req, res) => {
  try {
    const userId = req.user.id;
    const { farmId } = req.params;
    const seasons = await seasonService.getSeasonsByFarm(userId, farmId);
    res.json(seasons);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};