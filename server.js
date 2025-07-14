const express = require("express");
const fs = require("fs").promises;
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const COUNTER_FILE = "./counter.json";

// Enable CORS for all origins
app.use(cors());

// Root route (GET request)
// Just get count, do not increment
app.get("/view", async (req, res) => {
  try {
    let data = await fs.readFile(COUNTER_FILE, "utf-8");
    let json = JSON.parse(data);
    res.json({ visits: json.visits });
  } catch (err) {
    console.error("View count error:", err);
    res.status(500).json({ error: "Failed to read counter" });
  }
});

app.get("/", async (req, res) => {
  try {
    let data = await fs.readFile(COUNTER_FILE, "utf-8");
    let json = JSON.parse(data);
    json.visits += 1;

    await fs.writeFile(COUNTER_FILE, JSON.stringify(json, null, 2));
    res.json({ visits: json.visits });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Counter server running at http://localhost:${PORT}`);
});
