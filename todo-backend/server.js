const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());

function checkApiKey(req, res, next) {
  const clientKey = req.headers['x-api-key'];
  if (!clientKey || clientKey !== API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
}

app.use('/api', checkApiKey);

let tasks = [];
let nextId = 1;

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Field "title" is required' });
  }
  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
