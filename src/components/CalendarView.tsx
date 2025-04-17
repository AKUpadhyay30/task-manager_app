import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views, Event, SlotInfo } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateTaskAsync, fetchTasks } from '../store/taskSlice';
import TaskForm from './TaskForm';
import { Task } from '../types/Task';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent extends Event {
  resource: Task;
  start: Date;
  end: Date;
}

const DragAndDropCalendar = withDragAndDrop<CalendarEvent, object>(Calendar as any);

const CalendarView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    // Only fetch if we don't have any tasks
    if (tasks.length === 0) {
      dispatch(fetchTasks());
    }
  }, [dispatch, tasks.length]);

  const events: CalendarEvent[] = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    resource: task
  }));

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedDate(slotInfo.start);
    setIsFormOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    // Handle event click if needed
    console.log('Event clicked:', event);
  };

  const handleEventDrop = (args: { event: CalendarEvent; start: string | Date }) => {
    const updatedTask = {
      ...args.event.resource,
      dueDate: args.start instanceof Date ? args.start.toISOString().split('T')[0] : new Date(args.start).toISOString().split('T')[0]
    };
    dispatch(updateTaskAsync({ id: updatedTask.id, task: updatedTask }));
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="h-[600px] relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-lg text-gray-600">Loading tasks...</div>
        </div>
      )}
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventDrop}
        defaultView={Views.MONTH}
        resizable
        draggableAccessor={() => true}
      />

      {isFormOpen && (
        <div className="fixed inset-0 z-[9999]">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75"></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl" style={{ backdropFilter: 'none' }}>
              <div className="bg-white" style={{ position: 'relative', zIndex: 1 }}>
                <h2 className="text-xl font-semibold mb-4">
                  Add Task for {selectedDate?.toLocaleDateString()}
                </h2>
                <div className="bg-white" style={{ position: 'relative', zIndex: 2 }}>
                  <TaskForm
                    task={selectedDate ? { dueDate: selectedDate.toISOString().split('T')[0] } as Task : undefined}
                    onCancel={handleCloseForm}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView; 