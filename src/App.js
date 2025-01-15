// src/App.js (Updated)
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import TaskManagerPage from './components/TaskManagerPage';
import ProjectForm from './components/ProjectForm';
import ProjectDetails from './components/ProjectDetails';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import axios from 'axios';
import './index.css';

function App() {
    const [projects, setProjects] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));  // Improved token check

    useEffect(() => {
      const fetchProjects = async () => {
          const token = localStorage.getItem('token');
          //console.log("Token Sent to Backend:", token); // Debug to verify token format
          if (!token) {
              alert('No token found. Please log in again.');
              return;
          }
  
          try {
              const response = await axios.get('http://localhost:5000/projects', {
                  headers: {
                      Authorization: token  // Ensuring correct format
                  }
              });
              console.log('Fetched Projects:', response.data); // Debugging
              setProjects(response.data);
          } catch (error) {
              console.error('Error fetching projects:', error);
              if (error.response?.status === 404) {
                // Handle no projects case gracefully
                setProjects([]);}
                else
              alert('Failed to fetch projects. Please check your token and try again.');
          }
      };
      if (isAuthenticated) fetchProjects();
  }, [isAuthenticated]);
  
  

    const addProject = (newProject) => {
        setProjects((prev) => [...prev, newProject]);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className="w-64 bg-gray-800 text-white p-6 space-y-6">
                    <h1 className="text-2xl font-bold">Navigate</h1>
                    <nav className="space-y-4">
                        <Link to="/" className="block hover:text-blue-400">Home</Link>
                        <Link to="/profile" className="block hover:text-blue-400">My Profile</Link>
                        {isAuthenticated ? (
                            <button
                                className="block text-red-400 hover:text-red-600 mt-4"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="block hover:text-blue-400">Login</Link>
                                <Link to="/register" className="block hover:text-blue-400">Register</Link>
                            </>
                        )}
                    </nav>
                </div>

                {/* Main Content Section */}
                <div className="flex-1 p-6">
                    <Routes>
                        {/* Redirect to login if not authenticated */}
                        <Route path="/" element={isAuthenticated ? (
                            <div>
                                <h1 className="text-3xl font-bold mb-6">Projects</h1>
                                {projects.length > 0 ? (
                                    projects.map((project) => (
                                        <div key={project.id} className="mb-4 p-4 border rounded flex justify-between items-center">
                                            {/* Left Section: Project Name and Links */}
                                            <div>
                                                <h2 className="text-xl font-semibold">{project.name}</h2>
                                                <Link to={`/projects/${project.id}`} className="text-blue-500 underline mr-4">
                                                    View Details
                                                </Link>
                                                <Link to={`/task-manager/${project.id}`} className="text-blue-500 underline">
                                                    Manage Tasks
                                                </Link>
                                            </div>

                                            {/* Right Section: Status */}
                                            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded">
                                                <p><strong>Status:</strong> {project.status || "N/A"}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No projects found. Create a new one below!</p>
                                )}
                                <ProjectForm addProject={addProject} />
                            </div>
                        ) : <Navigate to="/login" />} />

                        {/* Project and Task Pages */}
                        <Route path="/projects/:projectId" element={<ProjectDetails />} />
                        <Route path="/task-manager/:projectId" element={<TaskManagerPage />} />

                        {/* Login and Registration Pages */}
                        <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
