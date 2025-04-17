import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '../types/Task';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface TaskContextType {
  tasks: Task[];
  notifications: Notification[];
  editingTask: Task | undefined;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Omit<Task, 'id'>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newDate: Date) => void;
  editTask: (task: Task) => void;
  clearEditingTask: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Project Documentation',
      description: 'Write comprehensive documentation for the project',
      dueDate: '2024-04-20',
      status: 'pending',
      priority: 'high',
      category: 'Documentation'
    },
    {
      id: '2',
      title: 'Review Code Changes',
      description: 'Review and approve recent code changes',
      dueDate: '2024-04-18',
      status: 'in-progress',
      priority: 'medium',
      category: 'Code Review'
    },
    {
      id: '3',
      title: 'Schedule Team Meeting',
      description: 'Organize weekly team meeting',
      dueDate: '2024-04-17',
      status: 'completed',
      priority: 'low',
      category: 'Meeting'
    }
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
    addNotification({ message: 'Task added successfully', type: 'success' });
  };

  const updateTask = (id: string, taskData: Omit<Task, 'id'>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...taskData, id } : task
    ));
    addNotification({ message: 'Task updated successfully', type: 'success' });
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    addNotification({ message: 'Task deleted successfully', type: 'success' });
  };

  const moveTask = (id: string, newDate: Date) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, dueDate: newDate.toISOString().split('T')[0] } : task
    ));
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
  };

  const clearEditingTask = () => {
    setEditingTask(undefined);
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications([...notifications, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      notifications,
      editingTask,
      addTask, 
      updateTask, 
      deleteTask, 
      moveTask,
      editTask,
      clearEditingTask,
      addNotification,
      removeNotification
    }}>
      {children}
    </TaskContext.Provider>
  );
}; 