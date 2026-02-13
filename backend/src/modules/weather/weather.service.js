import axios from 'axios';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getCurrentWeather = async (district) => {
  if (!API_KEY) throw new Error("API Key not configured");

  // Force query to look for the district inside Bihar, India to avoid ambiguity
  const query = `${district}, Bihar, IN`;

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: query,
        units: 'metric', // Use Celsius
        appid: API_KEY
      }
    });

    const data = response.data;

    // Transform data into a clean structure for our frontend
    return {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main, // e.g., "Rain", "Clear"
      description: data.weather[0].description, // e.g., "light rain"
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon, // OpenWeatherMap icon code
      location: data.name
    };
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message);
    // Return null or a mock object so the app doesn't crash if API fails
    throw new Error("Failed to fetch weather data");
  }
};