import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { fetchTasks } from './store/taskSlice';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import TaskFilter from './components/TaskFilter';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Task } from './types/Task';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Task List
                </Link>
                <Link
                  to="/calendar"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Calendar
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Task Manager</h1>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add New Task
              </button>
            </div>

            {/* <TaskFilter /> */}

            <Routes>
              <Route
                path="/"
                element={
                  <div className="bg-white rounded-lg shadow p-6">
                    <TaskList onEdit={handleEditTask} />
                  </div>
                }
              />
              <Route
                path="/calendar"
                element={
                  <div className="bg-white rounded-lg shadow p-6">
                    <CalendarView />
                  </div>
                }
              />
            </Routes>
          </div>
        </main>

        {/* {isFormOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <TaskForm
                task={editingTask}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        )} */}
        {isFormOpen && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
      <TaskForm
        task={editingTask}
        onCancel={handleCloseForm}
      />
    </div>
  </div>
)}

      </div>
    </Router>
  );
};

export default App; 