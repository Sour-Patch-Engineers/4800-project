
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "11111Sour#",
  database: "task_manager_db",
  connectLimit: 10
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Route to get all tasks
app.get('/tasks', (req, res) => {
  const sql = 'SELECT * FROM Tasks';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
    res.json(result);
  });
});

// Route to add a task
app.post('/tasks', (req, res) => {
  const { title, description, dueDate, assignedTo, reminderDate } = req.body;
  const sql = 'INSERT INTO Tasks (title, description, dueDate, assignedTo, reminderDate) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, description, dueDate, assignedTo, reminderDate], (err, result) => {
    if (err) {
      console.error('Error adding task:', err);
      return res.status(500).json({ error: 'Failed to add task' });
    }
    res.json({ message: 'Task added', taskId: result.insertId });
  });
});

// Route to delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Tasks WHERE taskId = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ error: 'Failed to delete task' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

// Optional: Route to update an existing task (if needed)
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, assignedTo, reminderDate } = req.body;

  const sql = 'UPDATE Tasks SET title = ?, description = ?, dueDate = ?, assignedTo = ?, reminderDate = ? WHERE taskId = ?';
  db.query(sql, [title, description, dueDate, assignedTo, reminderDate, id], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).json({ error: 'Failed to update task' });
    }
    res.json({ message: 'Task updated successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});