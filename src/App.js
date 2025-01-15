// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TaskManagerPage from './components/TaskManagerPage';
import ProjectForm from './components/ProjectForm';
import ProjectDetails from './components/ProjectDetails';
import axios from 'axios';
import './index.css';

function App() {
    const [projects, setProjects] = useState([]);

    // Fetch projects from the database on component mount
    useEffect(() => {
        axios.get('http://localhost:5000/projects')
            .then((response) => {
                setProjects(response.data);
            })
            .catch((error) => {
                console.error('Error fetching projects:', error);
            });
    }, []);

    // Function to add a project (passed to ProjectForm)
    const addProject = (newProject) => {
        setProjects((prev) => [...prev, newProject]);
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
                    </nav>
                </div>

                {/* Main Content Section */}
                <div className="flex-1 p-6">
                    <Routes>
                        {/* Home Page with Project List and Forms */}
                        <Route path="/" element={
                            <div>
                                <h1 className="text-3xl font-bold mb-6">Projects</h1>
                                {/* Display the projects fetched from the database */}
                                {projects.length > 0 ? (
                                    projects.map((project) => (
                                        <div key={project.projectId} className="mb-4 p-4 border rounded">
                                            <h2 className="text-xl font-semibold">{project.name}</h2>
                                            
                                            {/* View Details Button */}
                                            <Link to={`/project-details/${project.projectId}`} 
                                                  className="text-blue-500 underline mr-4">
                                                View Details
                                            </Link>

                                            {/* Manage Tasks Button */}
                                            <Link to={`/task-manager/${project.projectId}`} 
                                                  className="text-blue-500 underline">
                                                Manage Tasks
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <p>No projects found. Create a new one below!</p>
                                )}
                                {/* Project Form Component */}
                                <ProjectForm addProject={addProject} />
                            </div>
                        } />

                        {/* Project Details Page */}
                        <Route path="/project-details/:projectId" element={<ProjectDetails />} />

                        {/* Task Manager Page */}
                        <Route path="/task-manager/:projectId" element={<TaskManagerPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
