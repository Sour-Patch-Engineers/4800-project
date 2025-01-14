import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = (task) => {
    if (editingTask) {
      axios.put(`http://localhost:5000/tasks/${editingTask.taskId}`, task)
        .then(() => {
          setTasks((prev) => prev.map((t) => (t.taskId === editingTask.taskId ? task : t)));
          setEditingTask(null);
        })
        .catch(() => alert('Error updating task'));
    } else {
      axios.post('http://localhost:5000/tasks', task)
        .then((response) => setTasks([...tasks, { ...task, taskId: response.data.taskId }]))
        .catch(() => alert('Error adding task'));
    }
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks((prev) => prev.filter((task) => task.taskId !== id)))
      .catch(() => alert('Error deleting task'));
  };

  const toggleTask = (id) => {
    const task = tasks.find((t) => t.taskId === id);
    axios.put(`http://localhost:5000/tasks/${id}`, { ...task, completed: !task.completed })
      .then(() => setTasks((prev) => prev.map((t) => (t.taskId === id ? { ...t, completed: !t.completed } : t))))
      .catch(() => alert('Error toggling task'));
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find((task) => task.taskId === id);
    setEditingTask(taskToEdit);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Task Manager</h1>
      <TaskForm onAddTask={addTask} editingTask={editingTask} />
      <TaskList tasks={tasks} onToggle={toggleTask} onEdit={editTask} onDelete={deleteTask} />
    </div>
  );
}

export default App;
