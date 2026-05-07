import { useEffect, useState } from 'react';
import TaskInput from './components/TaskInput.jsx';
import TaskList from './components/TaskList.jsx';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_KEY = import.meta.env.VITE_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
};

function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch(`${API_BASE}/api/tasks`, { headers });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (title) => {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title }),
    });
    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
  };

  const handleDeleteTask = async (id) => {
    await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'DELETE',
      headers,
    });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTask = async (id, payload) => {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  return (
    <div className="app">
      <h1>TodoList</h1>
      <TaskInput onAdd={handleAddTask} />
      <TaskList
        tasks={tasks}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}

export default App;
