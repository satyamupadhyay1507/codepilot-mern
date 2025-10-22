import React, { useState, useEffect } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import axios from "axios";

function App() {
  const [code, setCode] = useState(`import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

function App() {
  return <h1>Hello CipherStudio!</h1>;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
`);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const backendURL = "http://localhost:8000";

  // Load all projects
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
      alert("Please enter a project name!");
      return;
    }
    const newProject = { name: projectName, code };
    try {
      await axios.post(`${backendURL}/api/projects`, newProject);
      alert("Project saved!");
      fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to save project!");
    }
  };

  // Delete project
  const deleteProject = async (name) => {
    try {
      await axios.delete(`${backendURL}/api/projects/${name}`);
      alert("Project deleted!");
      fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to delete project!");
    }
  };

  // Load project code
  const loadProject = async (name) => {
    try {
      const res = await axios.get(`${backendURL}/api/projects/${name}`);
      if (res.data.files && res.data.files["/App.js"]) {
        setCode(res.data.files["/App.js"]);
        setProjectName(res.data.name);
        alert(`Loaded project: ${name}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load project!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>⚡ CipherStudio - Browser IDE</h1>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={saveProject} style={{ padding: "8px 12px" }}>
          Save Project
        </button>
      </div>

      <h3>Saved Projects:</h3>
      <ul>
        {projects.map((p, i) => (
          <li key={i}>
            {p.name}
            <button
              onClick={() => loadProject(p.name)}
              style={{
                marginLeft: "10px",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Load
            </button>
            <button
              onClick={() => deleteProject(p.name)}
              style={{
                marginLeft: "10px",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h2>Code Editor:</h2>
      <Sandpack
        template="react"
        files={{
          "/App.js": {
            code,
            active: true,
          },
        }}
        options={{
          showConsole: true,
          editorHeight: 400,
          autorun: true,
        }}
      />
    </div>
  );
}

export default App;