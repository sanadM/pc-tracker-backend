const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));
const { Resend } = require("resend");
const resend = new Resend("YOUR_RESEND_API_KEY_HERE");

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
app.post("/send-alert", async (req, res) => {
  const { productName, oldPrice, newPrice, url, email } = req.body;

  try {
    await resend.emails.send({
      from: "PC Tracker <onboarding@resend.dev>",
      to: email,
      subject: `💰 Price Drop Alert: ${productName}`,
      html: `
        <div style="font-family:Arial,sans-serif; max-width:600px; margin:0 auto; background:#0f0f0f; color:#e0e0e0; padding:30px; border-radius:12px;">
          <h1 style="color:#00aaff;">💰 Price Drop Detected!</h1>
          <p style="margin-top:16px;">Good news! A product you're tracking just dropped in price.</p>
          <div style="background:#1a1a1a; border-radius:8px; padding:20px; margin:24px 0;">
            <h2 style="color:#fff; font-size:1rem;">${productName}</h2>
            <p style="margin-top:12px;">Old price: <span style="color:#888; text-decoration:line-through;">$${oldPrice}</span></p>
            <p style="margin-top:4px;">New price: <span style="color:#00ff99; font-size:1.4rem; font-weight:bold;">$${newPrice}</span></p>
          </div>
          <a href="${url}" style="display:inline-block; background:#00aaff; color:#000; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">View Product →</a>
          <p style="margin-top:24px; color:#555; font-size:0.8rem;">You're receiving this because you're tracking this item on PC Parts Price Tracker.</p>
        </div>
      `
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));