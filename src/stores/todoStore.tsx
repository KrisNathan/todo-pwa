import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  isImportant: boolean;

  listId: string;
}

export interface List {
  id: string;
  icon: string; // emoji
  title: string;
}

type State = {
  tasks: Task[];
  lists: List[];
}

type Actions = {
  addTask: (task: Omit<Task, 'id'>, taskIdOverride?: string) => void;
  removeTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getImportantTasks: () => Task[];

  addList: (list: List) => void;
  removeList: (listId: string) => void;
  updateList: (listId: string, updates: Partial<List>) => void;
  getListById: (listId: string) => List | undefined;
}

const useTodoStore = create<State & Actions>()(immer((set, get) => ({
  tasks: [],
  lists: [],

  addTask: (task, taskIdOverride) => set((state) => {
    const newTask: Task = {
      ...task,
      id: taskIdOverride ? taskIdOverride : crypto.randomUUID(),
    }
    state.tasks.push(newTask);
  }),

  removeTask: (taskId) => set((state) => {
    state.tasks = state.tasks.filter(task => task.id !== taskId);
  }),

  updateTask: (taskId, updates) => set((state) => {
    const task = state.tasks.find(task => task.id === taskId);
    if (task) {
      Object.assign(task, updates);
    }
  }),

  getTaskById: (taskId: string): Task | undefined => {
    const state = get();
    return state.tasks.find((task: Task) => task.id === taskId);
  },

  getImportantTasks: () => {
    const state = get();
    return state.tasks.filter(task => task.isImportant);
  },

  addList: (list) => set((state) => {
    state.lists.push(list);
  }),

  removeList: (listId) => set((state) => {
    state.lists = state.lists.filter(list => list.id !== listId);
    state.tasks = state.tasks.filter(task => task.listId !== listId);
  }),

  updateList: (listId, updates) => set((state) => {
    const list = state.lists.find(list => list.id === listId);
    if (list) {
      Object.assign(list, updates);
    }
  }),
  getListById: (listId: string): List | undefined => {
    const state = get();
    return state.lists.find((list: List) => list.id === listId);
  },
})));

export default useTodoStore;