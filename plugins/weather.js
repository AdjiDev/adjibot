// plugins/weather.js
const fetch = require("node-fetch");
const config = require("../config");

module.exports = {
  name: ["weather"],
  description: "Get weather information for a location",
  category: ["Tools"],
  limit: 1,
  async execute(m, client) {
    const args = m.text.trim().split(/ +/).slice(1);
    if (args.length === 0) return m.reply("Please provide a location.");

    const location = args.join(" ");
    const apiKey = config.secret.weatherApiKey; // Make sure to set your weather API key in config
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.cod !== 200) {
        return m.reply(`Error fetching weather data: ${data.message}`);
      }

      const weatherInfo = `
      Weather in ${data.name}:
      Temperature: ${data.main.temp}°C
      Weather: ${data.weather[0].description}
      Humidity: ${data.main.humidity}%
      Wind Speed: ${data.wind.speed} m/s
      `;

      m.reply(weatherInfo);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      m.reply("An error occurred while fetching weather data.");
    }
  },
};
