// src/components/ProjectForm.js
import React, { useState } from 'react';
import axios from 'axios';

function ProjectForm({ addProject }) {
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        status: '',
        dueDate: '',
        collaborators: ''
    });
    const [showForm, setShowForm] = useState(false);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: value });
    };

    // Submit the form and send data to the server
    const handleSubmit = async () => {
        if (newProject.name && newProject.status && newProject.dueDate) {
            const token = localStorage.getItem('token'); // Retrieve token
    
            try {
                console.log('Submitting Project Data:', newProject);
                const response = await axios.post(
                    'http://localhost:5000/projects',
                    newProject,
                    {
                        headers: { Authorization: token },
                    }
                );
                console.log('Server Response:', response.data);
                alert(response.data.message);
                addProject({ ...newProject, id: response.data.projectId }); // Add project with ID
                setShowForm(false);
                setNewProject({ name: '', description: '', status: '', dueDate: '', collaborators: '' });
            } catch (error) {
                console.error('Error adding project:', error.response?.data || error.message);
                alert('Failed to add project');
            }
        } else {
            alert('Please fill in all required fields!');
        }
    };
    

    return (
        <div className="mt-6">
            {/* Button to Toggle Form */}
            <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {showForm ? 'Cancel' : 'Create New Project'}
            </button>

            {/* Project Form */}
            {showForm && (
                <form className="mt-6 p-4 border rounded space-y-4">
                    <label className="block font-semibold text-lg">Project Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={newProject.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />

                    <label className="block font-semibold text-lg">Description:</label>
                    <textarea
                        name="description"
                        value={newProject.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />

                    <label className="block font-semibold text-lg">Status:</label>
                    <select
                        name="status"
                        value={newProject.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Status</option>
                        <option value="Defined">Defined</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Complete">Complete</option>
                    </select>

                    <label className="block font-semibold text-lg">Due Date:</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={newProject.dueDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />

                    <label className="block font-semibold text-lg">Collaborators:</label>
                    <input
                        type="text"
                        name="collaborators"
                        value={newProject.collaborators}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Add Project
                    </button>
                </form>
            )}
        </div>
    );
}

export default ProjectForm;
