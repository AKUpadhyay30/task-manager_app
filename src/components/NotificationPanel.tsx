import React, { useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';

const NotificationPanel: React.FC = () => {
  const { notifications, removeNotification } = useTaskContext();

  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    notifications.forEach(notification => {
      const timeoutId = setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);

      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [notifications, removeNotification]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border ${getNotificationColor(
            notification.type
          )} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel; 