const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const MONGODB_URI = process.env.MONGO_URI;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// 🔹 Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 🔹 Define schema & model
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  visits: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

// 🔹 Initialize counter in DB if not exists
async function initializeCounter() {
  const existing = await Counter.findOne({ name: "pageViews" });
  if (!existing) {
    await Counter.create({ name: "pageViews", visits: 0 });
  }
}

// 🔹 Get current view count
app.get("/view", async (req, res) => {
  try {
    await initializeCounter();
    const counter = await Counter.findOne({ name: "pageViews" });
    res.json({ visits: counter.visits });
  } catch (err) {
    console.error("Error fetching count:", err);
    res.status(500).json({ error: "Failed to fetch view count" });
  }
});

// 🔹 Increment and update view count
app.get("/", async (req, res) => {
  try {
    await initializeCounter();
    const counter = await Counter.findOneAndUpdate(
      { name: "pageViews" },
      { $inc: { visits: 1 } },
      { new: true }
    );
    res.json({ visits: counter.visits });
  } catch (err) {
    console.error("Error updating count:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔹 Start the server
app.listen(PORT, () => {
  console.log(`✅ MongoDB Counter server running at http://localhost:${PORT}`);
});
