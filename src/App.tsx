import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { Task, TaskStatus } from './types';
import { TaskList } from './components/TaskList';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((task) =>
        statusFilter === 'all' ? true : task.status === statusFilter
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [tasks, searchQuery, statusFilter]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      const now = new Date();
      let taskDueDate: Date | undefined;
      
      if (dueDate && dueTime) {
        const [year, month, day] = dueDate.split('-').map(Number);
        const [hours, minutes] = dueTime.split(':').map(Number);
        taskDueDate = new Date(year, month - 1, day, hours, minutes);
      }

      const task: Task = {
        id: crypto.randomUUID(),
        title: newTask,
        status: 'not-started',
        createdAt: now,
        updatedAt: now,
        dueDate: taskDueDate,
      };
      setTasks([task, ...tasks]);
      setNewTask('');
      setDueDate('');
      setDueTime('');
    }
  };

  const handleUpdateTask = (id: string, title: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, title, updatedAt: new Date() }
          : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status, updatedAt: new Date() }
          : task
      )
    );
  };

  return (
    <div className={theme.isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <div className="container mx-auto max-w-3xl px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">TaskSphere</h1>
            <ThemeToggle isDark={theme.isDark} onToggle={toggleTheme} />
          </div>

          <form onSubmit={handleAddTask} className="mb-8 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="dueTime" className="block text-sm font-medium mb-1">
                  Due Time
                </label>
                <input
                  type="time"
                  id="dueTime"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                />
              </div>
            </div>
          </form>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
              />
            </div>

            <div className="flex gap-2">
              {(['all', 'not-started', 'active', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    statusFilter === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <TaskList
            tasks={filteredTasks}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;