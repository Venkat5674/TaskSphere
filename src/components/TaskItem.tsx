import React, { useState } from 'react';
import { Task } from '../types';
import { Check, Edit2, Trash2, X, Clock } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export function TaskItem({ task, onUpdate, onDelete, onStatusChange }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSubmit = () => {
    if (editedTitle.trim()) {
      onUpdate(task.id, editedTitle);
      setIsEditing(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="group flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      <button
        onClick={() => onStatusChange(task.id, task.status === 'completed' ? 'not-started' : 'completed')}
        className={`p-2 rounded-full transition-colors duration-200 ${
          task.status === 'completed'
            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
        }`}
      >
        <Check size={18} />
      </button>

      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-1"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-gray-700 rounded-full"
          >
            <Check size={18} />
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1">
            <span className={task.status === 'completed' ? 'line-through text-gray-400' : ''}>
              {task.title}
            </span>
            {task.dueDate && (
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Clock size={14} />
                <span>Due: {formatDateTime(task.dueDate)}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 rounded-full"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}