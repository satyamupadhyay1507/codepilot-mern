import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview
} from "@codesandbox/sandpack-react";

// import "@codesandbox/sandpack-react/dist/index.css";

function App() {
  const backendURL = "http://localhost:8000";

  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);

  const [files, setFiles] = useState({
    "/App.js": `export default function App() {
  return <h1>Hello CodePilot!</h1>;
}`
  });

  // Fetch all projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Save project
  const saveProject = async () => {
    if (!projectName) {
      alert("Please enter a project name");
      return;
    }

    try {
      await axios.post(`${backendURL}/api/projects`, {
        name: projectName,
        files
      });
      alert("Project saved");
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    }
  };

  // Load project
  const loadProject = async (name) => {
    try {
      const res = await axios.get(`${backendURL}/api/projects/${name}`);
      setFiles(res.data.files);
      setProjectName(res.data.name);
      alert(`Loaded project: ${name}`);
    } catch (err) {
      console.error(err);
      alert("Failed to load project");
    }
  };

  // Delete project
  const deleteProject = async (name) => {
    try {
      await axios.delete(`${backendURL}/api/projects/${name}`);
      alert("Project deleted");
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  return (
  <>
    <Header />

    <Routes>
      {/* EDITOR PAGE */}
      <Route
        path="/"
        element={
          <div style={{ padding: 20 }}>
            <div className="project-actions" style={{ marginBottom: 12 }}>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project name"
                style={{ padding: 8, marginRight: 8 }}
              />

              <button
                className="btn btn-primary"
                onClick={saveProject}
                style={{ padding: "8px 12px" }}
              >
                Save
              </button>
              <button type="button" class="btn btn-primary"
        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
  Custom button
</button>

            </div>

            <h3>Saed Projects</h3>
            <ul>
              {projects.map((p) => (
                <li key={p._id}>
                  {p.name}
                  <button 
                    onClick={() => loadProject(p.name)}
                    style={{ marginLeft: 8 }}
                  >
                    Load
                  </button>


                  <button
                    onClick={() => deleteProject(p.name)}
                    style={{ marginLeft: 8 }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            <h2>Editor</h2>

            <SandpackProvider template="react" files={files}>
              <SandpackLayout>
                <SandpackCodeEditor style={{ height: 400 }} />
                <SandpackPreview />
              </SandpackLayout>
            </SandpackProvider>
          </div>
        }
      />

      {/* ADMIN PAGE */}
      <Route path="/admin" element={<Admin />} />
    </Routes>

    <Footer />
  </>
);
}

export default App;