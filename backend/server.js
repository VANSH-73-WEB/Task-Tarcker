const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const taskRoutes = require("./routes/tasks");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

const allowedOrigins = [
  'http://localhost:5173',
  'https://task-tarcker.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Task Tracker API is running 🚀", version: "1.0.0" });
});

app.use("/api/tasks", taskRoutes);

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── DB Connection ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
