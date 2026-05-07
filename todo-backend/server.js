const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.url} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

function checkApiKey(req, res, next) {
  try {
    const clientKey = req.headers['x-api-key'];
    if (!clientKey || clientKey !== API_KEY) {
      return res.status(401).json({ error: 'Invalid or missing API key' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

app.use('/api', checkApiKey);

let tasks = [];
let nextId = 1;

app.get('/api/tasks', (req, res) => {
  try {
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Field "title" is required' });
    }
    const task = { id: nextId++, title: title.trim(), done: false };
    tasks.push(task);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const { title, done } = req.body;
    if (title !== undefined) task.title = String(title).trim();
    if (done !== undefined) task.done = Boolean(done);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    tasks.splice(index, 1);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
