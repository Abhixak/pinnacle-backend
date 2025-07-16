const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const COUNTER_FILE = path.join(__dirname, "counter.json");

app.use(cors());

// Ensure counter.json exists or create one with visits = 0
async function initializeCounterFile() {
  try {
    await fs.access(COUNTER_FILE);
  } catch {
    await fs.writeFile(COUNTER_FILE, JSON.stringify({ visits: 0 }, null, 2));
  }
}

// Get current view count
app.get("/view", async (req, res) => {
  try {
    await initializeCounterFile();
    const data = await fs.readFile(COUNTER_FILE, "utf-8");
    const json = JSON.parse(data);
    res.json({ visits: json.visits });
  } catch (err) {
    console.error("View count error:", err);
    res.status(500).json({ error: "Failed to read counter" });
  }
});

// Increment and update view count
app.get("/", async (req, res) => {
  try {
    await initializeCounterFile();
    const data = await fs.readFile(COUNTER_FILE, "utf-8");
    const json = JSON.parse(data);

    json.visits += 1;

    await fs.writeFile(COUNTER_FILE, JSON.stringify(json, null, 2));
    res.json({ visits: json.visits });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Counter server running at http://localhost:${PORT}`);
});
