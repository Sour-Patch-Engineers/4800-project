// src/components/TaskManagerPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import axios from 'axios';

function TaskManagerPage() {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const { projectId } = useParams(); // Capture projectId from URL

    useEffect(() => {
        let isMounted = true; // Prevent unnecessary calls
        axios.get(`http://localhost:5000/projects/${projectId}/tasks`)
            .then((response) => {
                if (isMounted) {
                    setTasks(response.data);
                }
            })
            .catch((error) => console.error('Error fetching tasks:', error));

        return () => {
            isMounted = false; // Cleanup to prevent state updates on unmounted components
        };
    }, [projectId]);

    const addTask = async (task) => {
        try {
            if (editingTask) {
                await axios.put(`http://localhost:5000/tasks/${editingTask.taskId}`, task);
                setTasks((prev) => prev.map((t) => (t.taskId === editingTask.taskId ? task : t)));
                setEditingTask(null);
            } else {
                const response = await axios.post('http://localhost:5000/tasks', task);
                setTasks((prev) => [...prev, { ...task, taskId: response.data.taskId }]);
            }
        } catch (error) {
            alert('Error while adding or updating task');
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            setTasks((prev) => prev.filter((task) => task.taskId !== id));
        } catch (error) {
            alert('Error deleting task');
        }
    };

    const toggleTask = async (id) => {
        try {
            const task = tasks.find((t) => t.taskId === id);
            await axios.put(`http://localhost:5000/tasks/${id}`, { ...task, completed: !task.completed });
            setTasks((prev) => prev.map((t) => (t.taskId === id ? { ...t, completed: !t.completed } : t)));
        } catch (error) {
            alert('Error toggling task');
        }
    };

    const editTask = (id) => {
        const taskToEdit = tasks.find((task) => task.taskId === id);
        setEditingTask(taskToEdit);
    };

    return (
        <div className="container mx-auto p-6">
            <Link to="/" className="text-blue-500 underline mb-4 block">Back to Projects</Link>
            <h1 className="text-3xl font-bold mb-6">Task Manager for Project {projectId}</h1>
            <TaskForm onAddTask={addTask} editingTask={editingTask} />
            <TaskList tasks={tasks} onToggle={toggleTask} onEdit={editTask} onDelete={deleteTask} />
        </div>
    );
}

export default TaskManagerPage;
