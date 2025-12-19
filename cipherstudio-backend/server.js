const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// ✅ Use Render / system port
const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGO_URI);


// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(bodyParser.json());

// ✅ Connect to MongoDB Atlas using ENV
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Schema & Model
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  files: { type: Object, default: {} },
});

const Project = mongoose.model("Project", projectSchema);

// Health check route
app.get("/", (req, res) => {
  res.send("CipherStudio backend is running 🚀");
});

// Get all project names
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find({}, "name");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// Get single project
app.get("/api/projects/:name", async (req, res) => {
  try {
    const project = await Project.findOne({ name: req.params.name });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Error fetching project" });
  }
});

// Save project
app.post("/api/projects", async (req, res) => {
  const { name, code } = req.body;
  try {
    await Project.create({
      name,
      files: { "/App.js": code },
    });
    res.status(201).json({ message: "Project saved successfully!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete project
app.delete("/api/projects/:name", async (req, res) => {
  try {
    await Project.deleteOne({ name: req.params.name });
    res.json({ message: "Project deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});