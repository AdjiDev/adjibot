// plugins/openstreetmap.js
const fetch = require("node-fetch");
const config = require("../config");

module.exports = {
  name: ["osm"],
  description: "Search OpenStreetMap by name, postal code, or latitude/longitude.",
  category: ["Utility"],
  limit: 1,
  async execute(m, client) {
    const args = m.text.trim().split(/ +/).slice(1);
    if (args.length < 2) {
      return m.reply("Usage: /osm <search|postal|lat> <args>");
    }

    const [type, ...query] = args;
    const queryString = query.join(" ");
    let url;

    try {
      if (type === "search") {
        url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryString)}`;
      } else if (type === "postal") {
        url = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${encodeURIComponent(queryString)}`;
      } else if (type === "lat") {
        const [lat, lon] = queryString.split(",").map(coord => coord.trim());
        if (!lat || !lon) {
          return m.reply("Usage: /osm lat <latitude,longitude>");
        }
        url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      } else {
        return m.reply("Invalid type. Use 'search', 'postal', or 'lat'.");
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!data || data.length === 0) {
        return m.reply("No results found.");
      }

      if (type === "postal" || type === "lat") {
        const location = type === "lat" ? data : data[0]; // Get first result for postal or directly for lat
        await client.sendMessage(m.chat, {
          location: {
            degreesLatitude: location.lat || location.boundingbox[0], // Use latitude from the response
            degreesLongitude: location.lon || location.boundingbox[2], // Use longitude from the response
            name: location.display_name || "Unknown Location", // Use display name for the location
          },
        });
      } else if (type === "search") {
        let resultText = "🔍 Search Results:\n";
        data.forEach(location => {
          resultText += `- *${location.display_name}*\n`;
        });
        m.reply(resultText);
      }
    } catch (error) {
      console.error("Error fetching OpenStreetMap data:", error);
      m.reply("An error occurred while fetching the data.");
    }
  },
};
