
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
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
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

// Route to add a new project
app.post('/projects', (req, res) => {
  const { name, description, status, dueDate, collaborators } = req.body;
  const sql = 'INSERT INTO Projects (name, description, status, dueDate, collaborators) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, description, status, dueDate, collaborators], (err, result) => {
      if (err) {
          console.error('Error adding project:', err);
          return res.status(500).json({ error: 'Failed to add project' });
      }
      res.json({ message: 'Project added successfully', projectId: result.insertId });
  });
});

// Route to fetch all projects from the database
app.get('/projects', (req, res) => {
  const sql = 'SELECT * FROM Projects';
  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error fetching projects:', err);
          return res.status(500).json({ error: 'Failed to fetch projects' });
      }
      res.json(result);
  });
});

// Route to fetch project details by ID
app.get('/projects/:projectId', (req, res) => {
  const { projectId } = req.params;
  const sql = 'SELECT * FROM Projects WHERE projectId = ?';
  db.query(sql, [projectId], (err, result) => {
      if (err) {
          console.error('Error fetching project details:', err);
          return res.status(500).json({ error: 'Database error occurred' });
      }
      if (result.length === 0) {
          return res.status(404).json({ error: 'Project not found' });
      }
      res.json(result[0]); // Return the project data
  });
});

app.put('/projects/:projectId', (req, res) => {
  const { projectId } = req.params;
  let { name, description, status, dueDate, collaborators } = req.body;

  // Convert the date to MySQL compatible format (YYYY-MM-DD)
  if (dueDate) {
    const formattedDate = new Date(dueDate).toISOString().split('T')[0]; 
    dueDate = formattedDate;
  }

  const sql = `
      UPDATE Projects 
      SET name = ?, description = ?, status = ?, dueDate = ?, collaborators = ? 
      WHERE projectId = ?
  `;

  db.query(sql, [name, description, status, dueDate, collaborators, projectId], (err, result) => {
      if (err) {
          console.error('Error updating project:', err);
          return res.status(500).json({ error: 'Failed to update project' });
      }
      res.json({ message: 'Project updated successfully' });
  });
});

