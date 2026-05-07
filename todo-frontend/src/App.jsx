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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDemoHost =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1' &&
    /^https?:\/\/(localhost|127\.0\.0\.1)/.test(API_BASE);

  const fetchTasks = async () => {
    if (isDemoHost) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/tasks`, { headers });
      if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (title) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error(`Не удалось добавить задачу: ${res.status}`);
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error(`Не удалось удалить задачу: ${res.status}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTask = async (id, payload) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Не удалось обновить задачу: ${res.status}`);
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <h1>TodoList</h1>
      {isDemoHost && (
        <p className="demo-banner">
          Демо-версия. Бэкенд работает локально — для полноценной работы запустите его по инструкции в README.
        </p>
      )}
      <TaskInput onAdd={handleAddTask} />
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="loading">Загрузка...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default App;
