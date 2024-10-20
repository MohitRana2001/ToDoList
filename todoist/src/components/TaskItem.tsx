import React from 'react';
import { Task } from '../types';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
}

export default function TaskItem({ task, onEdit, onDelete, onToggleComplete }: TaskItemProps) {
  const handleToggleComplete = async () => {
    try {
      await onToggleComplete(task.id, !task.completed);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // Optionally, you can add error handling UI here
    }
  };

  return (
    <li className="task-item">
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className="task-checkbox"
        />
        <span className={`task-title ${task.completed ? 'completed' : ''}`}>{task.title}</span>
      </div>
      <div className="task-actions">
        <button onClick={() => onEdit(task)} className="edit-button">
          Edit
        </button>
        <button onClick={() => onDelete(task.id)} className="delete-button">
          Delete
        </button>
      </div>
    </li>
  );
}
