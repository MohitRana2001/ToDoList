import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import './TaskForm.css';

interface TaskFormProps {
  task: Task | null;
  onSubmit: (task: Omit<Task, 'id'>) => void;
}

export default function TaskForm({ task, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onSubmit({ title, description, status: 'pending', completed: false });
    setTitle('');
    setDescription('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          className="form-input"
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="submit-button">
        {task ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
}