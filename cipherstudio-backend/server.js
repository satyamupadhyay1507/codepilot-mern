const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;

// Middleware — Allow all origins
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/cipherstudio", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Define schema & model
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  files: { type: Object, default: {} },
});
const Project = mongoose.model("Project", projectSchema);

// Routes
app.get("/", (req, res) => {
  res.send("CipherStudio backend is running ");
});

// Get all projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find({}, "name"); // only send project names
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects", error: err.message });
  }
});

// Get a single project by name
app.get("/api/projects/:name", async (req, res) => {
  try {
    const project = await Project.findOne({ name: req.params.name });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Error fetching project", error: err.message });
  }
});

// Save new project
app.post("/api/projects", async (req, res) => {
  const { name, code } = req.body;
  try {
    await Project.create({ name, files: { "/App.js": code } });
    res.status(201).json({ message: "Project saved successfully!" });
  } catch (err) {
    res.status(400).json({ message: "Failed to save project", error: err.message });
  }
});

// Delete project
app.delete("/api/projects/:name", async (req, res) => {
  try {
    await Project.deleteOne({ name: req.params.name });
    res.json({ message: "Project deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project", error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});