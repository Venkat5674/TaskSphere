import React from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export function TaskList({ tasks, onUpdate, onDelete, onStatusChange }: TaskListProps) {
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
          >
            <TaskItem
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}