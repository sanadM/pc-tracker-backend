const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const app = express();
app.use(cors());

const RAPIDAPI_KEY = "YOUR_RAPIDAPI_KEY_HERE";

app.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "No search query provided" });
  }

  try {
    const response = await fetch(
      `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query + " PC part computer hardware")}&country=us&language=en&limit=20`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "real-time-product-search.p.rapidapi.com",
          "x-rapidapi-key": "d9eabcd5b5msh302fd35dbb38235p1efdafjsn29b7aa26ae3e"
        }
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/fetch-title", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    const html = await response.text();
    const match = html.match(/<title>(.*?)<\/title>/i);
    const title = match 
      ? match[1]
          .replace(" - Amazon.com", "")
          .replace(" | Newegg.com", "")
          .replace(" | eBay", "")
          .trim() 
      : "Unknown Product";
    res.json({ title });
  } catch (error) {
    res.json({ title: "Unknown Product" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));