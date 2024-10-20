import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import SearchBar from './components/SearchBar';
import FilterButtons from './components/FilterButtons';
import { Task } from './types';
import './App.css';
declare global {

  interface Window {
    catalyst: any;
  }
}

const API_BASE_URL = "/server/todo_list_function";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/tasks`, 
          {
            headers: {
              'Content-Type': 'application/json',
            },
          } 
        );
        console.log("Fetched tasks:", response.data.tasks);
        if (Array.isArray(response.data.tasks)) {
            setTasks(response.data.tasks);
        } else {
            setError('Invalid data format received from server.');
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks. Please try again later.');
    } finally {
        setIsLoading(false);
    }
};


  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/tasks`, task);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  const updateTask = async (id: number, updatedTask: Partial<Task>) => {
    try {
      setError(null);
      const response = await axios.put(`${API_BASE_URL}/tasks`, { id, ...updatedTask });
      setTasks(tasks.map(task => task.id === id ? response.data : task));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setError(null);
      await axios.delete(`${API_BASE_URL}/tasks`, { data: { id } });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const toggleTaskComplete = async (id: number, completed: boolean) => {
    try {
      await updateTask(id, { completed });
    } catch (error) {
      console.error('Error toggling task completion:', error);
      setError('Failed to update task completion. Please try again.');
    }
  };

  if(isLoading) return <div className="loader">Loading...</div>;

  const filteredTasks = Array.isArray(tasks)
  ? tasks
      .filter(task => {
          if (filter === 'completed') return task.completed;
          if (filter === 'pending') return !task.completed;
          return true;
      })
      .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
  : []; // Fallback to an empty array if tasks is not an array



  return (
    <div className="app-container">
      {isLoading && <div className="loader">Loading...</div>}
        <h1 className='app-title'>Task Manager</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FilterButtons filter={filter} setFilter={setFilter} />
      <TaskForm task={editingTask} onSubmit={(task) => editingTask ? updateTask(editingTask.id, task) : addTask(task)} />
      <TaskList
        tasks={filteredTasks}
        onEdit={setEditingTask}
        onDelete={deleteTask}
        onToggleComplete={toggleTaskComplete}
      />
    </div>
  );
}
