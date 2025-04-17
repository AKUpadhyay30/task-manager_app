import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { addTaskAsync, updateTaskAsync } from '../store/taskSlice';
import { Task } from '../types/Task';

interface TaskFormProps {
  task?: Task;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  dueDate: Yup.date()
    .required('Due date is required')
    .min(new Date(), 'Due date cannot be in the past'),
  status: Yup.string().required('Status is required'),
  priority: Yup.string().required('Priority is required'),
  category: Yup.string().required('Category is required'),
});

const TaskForm: React.FC<TaskFormProps> = ({ task, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialValues: Omit<Task, 'id'> = {
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || new Date().toISOString().split('T')[0],
    status: task?.status || 'pending',
    priority: task?.priority || 'medium',
    category: task?.category || '',
  };

  const handleSubmit = (values: Omit<Task, 'id'>) => {
    if (task) {
      dispatch(updateTaskAsync({ id: task.id, task: values }));
    } else {
      dispatch(addTaskAsync(values));
    }
    onCancel();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4" style={{ position: 'relative', zIndex: 3 }}>
          <div className="bg-white p-4 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <Field
                name="title"
                type="text"
                className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0 ${
                  errors.title && touched.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <ErrorMessage name="title" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <Field
                name="description"
                as="textarea"
                rows={3}
                className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0 ${
                  errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <Field
                name="dueDate"
                type="date"
                className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0 ${
                  errors.dueDate && touched.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <ErrorMessage name="dueDate" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <Field
                name="status"
                as="select"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </Field>
              <ErrorMessage name="status" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <Field
                name="priority"
                as="select"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Field>
              <ErrorMessage name="priority" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <Field
                name="category"
                type="text"
                className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0 ${
                  errors.category && touched.category ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <ErrorMessage name="category" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                {task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TaskForm; 