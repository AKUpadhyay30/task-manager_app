import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { Task } from '../types/Task';

const TaskFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const [statusFilter, setStatusFilter] = React.useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = React.useState<Task['priority'] | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');

  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(tasks.map(task => task.category));
    return Array.from(uniqueCategories);
  }, [tasks]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as Task['status'] | 'all');
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value as Task['priority'] | 'all');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 p-2">Filter bhhy Status</label>
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Priority</label>
        <select
          value={priorityFilter}
          onChange={handlePriorityChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskFilter; 