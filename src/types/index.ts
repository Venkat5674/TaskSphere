export type TaskStatus = 'not-started' | 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface Theme {
  isDark: boolean;
}