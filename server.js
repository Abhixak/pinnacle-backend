const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3001;
const COUNTER_FILE = "./counter.json";

app.use(cors()); // allow requests from your React frontend

app.get("/api/visit", (req, res) => {
  fs.readFile(COUNTER_FILE, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read counter." });

    let json = JSON.parse(data);
    json.visits += 1;

    fs.writeFile(COUNTER_FILE, JSON.stringify(json), (err) => {
      if (err) return res.status(500).json({ error: "Failed to write counter." });
      res.json({ visits: json.visits });
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Counter server running at http://localhost:${PORT}`);
});
