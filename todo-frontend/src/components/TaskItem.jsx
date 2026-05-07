import { useState } from 'react';

function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  const handleToggleDone = () => {
    onUpdate(task.id, { done: !task.done });
  };

  const handleSave = () => {
    const trimmed = draftTitle.trim();
    if (!trimmed) return;
    onUpdate(task.id, { title: trimmed });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftTitle(task.title);
    setIsEditing(false);
  };

  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={handleToggleDone}
      />
      {isEditing ? (
        <>
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            autoFocus
          />
          <button onClick={handleSave}>Сохранить</button>
          <button onClick={handleCancel}>Отмена</button>
        </>
      ) : (
        <>
          <span className="title" onDoubleClick={() => setIsEditing(true)}>
            {task.title}
          </span>
          <button onClick={() => setIsEditing(true)}>Изменить</button>
          <button onClick={() => onDelete(task.id)}>Удалить</button>
        </>
      )}
    </li>
  );
}

export default TaskItem;
