import React, { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const backendURL = "https://codepilot-mern.onrender.com";
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${backendURL}/api/projects/${name}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading projects...</p>;
  }

  return (
    <div className="admin-container">
      <h1>🛠 Admin Dashboard</h1>
      <p className="admin-subtitle">Manage backend data</p>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="admin-list">
          {projects.map((project) => (
            <div key={project._id} className="admin-card">
              <div className="admin-card-header">
                <h3>{project.name}</h3>
                <button
                  className="admin-delete-btn"
                  onClick={() => deleteProject(project.name)}
                >
                  Delete
                </button>
              </div>

              <pre className="admin-code">
                {JSON.stringify(project.files, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;