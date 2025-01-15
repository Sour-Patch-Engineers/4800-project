require('dotenv').config();  

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;
const secretKey = 'your_jwt_secret_key'; // Change this to a secure key in production

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

// Check if environment variables are loaded correctly (for debugging)
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Register Endpoint
app.post('/register', async (req, res) => {
  const { name, username, password, email } = req.body;
  
  // Basic validation
  if (!name || !username || !password || !email) {
      return res.status(400).send('All fields are required');
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = `INSERT INTO users (name, username, password, email) VALUES (?, ?, ?, ?)`;
      db.query(sql, [name, username, hashedPassword, email], (err) => {
          if (err) {
              if (err.code === 'ER_DUP_ENTRY') {
                  return res.status(400).send('Username or Email already exists');
              }
              return res.status(500).send(err);
          }
          res.status(201).send('User registered successfully');
      });
  } catch (error) {
      res.status(500).send('Error during registration');
  }
});

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM users WHERE username = ?`;

  db.query(sql, [username], async (err, results) => {
      if (err) return res.status(500).send('Error on server side');
      if (results.length === 0) return res.status(401).send('Invalid username or password');

      // Compare password
      const match = await bcrypt.compare(password, results[0].password);
      if (match) {
          const token = jwt.sign({ id: results[0].id }, secretKey, { expiresIn: '1h' });
          res.json({ token });
      } else {
          res.status(401).send('Invalid credentials');
      }
  });
});

// // Secure Endpoint (Example)
// app.get('/projects', (req, res) => {
//   const token = req.headers.authorization;
//   if (!token) return res.status(403).send('No token provided');

//   jwt.verify(token, secretKey, (err, decoded) => {
//       if (err) return res.status(401).send('Invalid token');
      
//       const sql = `SELECT * FROM projects`;
//       db.query(sql, (err, results) => {
//           if (err) return res.status(500).send('Error fetching projects');
//           res.json(results);
//       });
//   });
// });


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

// Route to add a new project
app.post('/projects', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).send('No token provided');

  jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return res.status(401).send('Invalid token');

      console.log('Decoded User ID:', decoded.id); // Debugging

      const { name, description, status, dueDate, collaborators } = req.body;
      console.log('Request Body:', req.body); // Debugging

      const sql = 'INSERT INTO Projects (name, description, status, dueDate, collaborators) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [name, description, status, dueDate, collaborators], (err, result) => {
          if (err) {
              console.error('Error adding project:', err);
              return res.status(500).json({ error: 'Failed to add project' });
          }

          const projectId = result.insertId;
          console.log('Inserted Project ID:', projectId); // Debugging

          const insertUserProjectSql = `INSERT INTO user_projects (user_id, project_id) VALUES (?, ?)`;
          db.query(insertUserProjectSql, [decoded.id, projectId], (err) => {
              if (err) {
                  console.error('Error linking user to project:', err);
                  return res.status(500).send('Failed to link user to project');
              }
              res.json({ message: 'Project added successfully', projectId });
          });
      });
  });
});


// Route to fetch projects for logged-in user
app.get('/projects', (req, res) => {
  const token = req.headers.authorization;
  //console.log('Raw Token Received:', token); // Debugging Token Receipt
  if (!token) {
      return res.status(403).send('No token provided');
  }

  // Correct token extraction with Bearer handling
  const tokenWithoutBearer = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
  //console.log('Token After Removal of Bearer:', tokenWithoutBearer); // Debugging Token Extraction

  jwt.verify(tokenWithoutBearer, secretKey, (err, decoded) => {
      if (err) {
          console.error('JWT Error:', err);
          return res.status(401).send('Invalid token');
      }

      //console.log('Decoded Token Payload:', decoded); 

      const sql = `
          SELECT p.projectId, p.name, p.description, p.status
          FROM projects p
          JOIN user_projects up ON p.projectId = up.project_id
          WHERE up.user_id = ?;
      `;

      db.query(sql, [decoded.id], (err, results) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).send('Error fetching projects');
          }
          if (results.length === 0) {
              return res.status(404).send('No projects found for this user.');
          }
          //console.log('Query Results with Status:', results); // Debugging
          res.json(results);
      });
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

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
