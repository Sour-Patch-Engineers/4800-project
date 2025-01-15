// src/components/ProjectDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ProjectDetails() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        console.log("Project ID being fetched:", projectId); // Debugging the value

        axios.get(`http://localhost:5000/projects/${projectId}`)
            .then((response) => {
                if (response.data && Object.keys(response.data).length > 0) {
                    const projectData = response.data;
                    if (projectData.dueDate) {
                        projectData.dueDate = new Date(projectData.dueDate).toISOString().split('T')[0];
                    }
                    setProject(projectData); 
                    setFormData(projectData);
                } else {
                    alert('Project not found!');
                }
            })
            .catch((error) => {
                console.error('Error fetching project details:', error.response?.data || error.message);
                alert('Failed to fetch project details.');
            });
    }, [projectId]);  // Corrected the dependency here from projected to projectId
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const updateProject = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/projects/${projectId}`, formData);
            alert(response.data.message);
            setProject(formData); // Update local state
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Failed to update project. Check console for details.');
        }
    };

    if (!project) return <p>Loading...</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Project Details</h1>
            
            {isEditing ? (
                <form className="space-y-4">
                    <label>Project Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />

                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />

                    <label>Status:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Defined">Defined</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Complete">Complete</option>
                    </select>

                    <label>Due Date:</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />

                    <label>Collaborators:</label>
                    <input
                        type="text"
                        name="collaborators"
                        value={formData.collaborators}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />

                    <button type="button" onClick={updateProject} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Save Changes
                    </button>
                </form>
            ) : (
                <div>
                    <p><strong>Name:</strong> {project.name}</p>
                    <p><strong>Description:</strong> {project.description}</p>
                    <p><strong>Status:</strong> {project.status}</p>
                    <p><strong>Due Date:</strong> {project.dueDate}</p>
                    <p><strong>Collaborators:</strong> {project.collaborators}</p>
                    <button onClick={() => setIsEditing(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        Edit Project
                    </button>
                </div>
            )}

            <div className="mt-6">
                <Link to="/" className="text-blue-500 underline mr-4">Back to Home</Link>
                <Link to={`/task-manager/${projectId}`} className="text-blue-500 underline">Manage Tasks</Link>
            </div>
        </div>
    );
}

export default ProjectDetails;
