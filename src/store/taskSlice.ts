import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../types/Task';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [
    {
      id: '1',
      title: 'Sample Task 1',
      description: 'This is a sample task',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      priority: 'medium',
      category: 'Work',
    },
    {
      id: '2',
      title: 'Sample Task 2',
      description: 'Another sample task',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'in-progress',
      priority: 'high',
      category: 'Personal',
    },
  ],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    // Simulate API call
    return new Promise<Task[]>((resolve) => {
      setTimeout(() => {
        resolve(initialState.tasks);
      }, 500);
    });
  }
);

export const addTaskAsync = createAsyncThunk(
  'tasks/addTask',
  async (task: Omit<Task, 'id'>) => {
    // Simulate API call
    return new Promise<Task>((resolve) => {
      setTimeout(() => {
        resolve({
          ...task,
          id: Math.random().toString(36).substr(2, 9),
        });
      }, 500);
    });
  }
);

export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, task }: { id: string; task: Omit<Task, 'id'> }) => {
    // Simulate API call
    return new Promise<Task>((resolve) => {
      setTimeout(() => {
        resolve({
          ...task,
          id,
        });
      }, 500);
    });
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string) => {
    // Simulate API call
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(id);
      }, 500);
    });
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Add Task
      .addCase(addTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskAsync.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add task';
      })
      // Update Task
      .addCase(updateTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task';
      })
      // Delete Task
      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete task';
      });
  },
});

export default taskSlice.reducer; 