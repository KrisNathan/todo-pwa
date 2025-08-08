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

export interface Workspace {
  id: string;
  // icon: string; // emoji
  name: string;
}

type State = {
  tasks: Task[];
  workspaces: Workspace[];
  defaultWorkspaceId: string;
  currentWorkspaceId: string;
}

type Actions = {
  addTask: (task: Omit<Task, 'id'>, taskIdOverride?: string) => void;
  removeTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getImportantTasks: () => Task[];

  addWorkspace: (list: Workspace) => void;
  removeWorkspace: (listId: string) => void;
  updateWorkspace: (listId: string, updates: Partial<Workspace>) => void;
  getWorkspaceById: (listId: string) => Workspace | undefined;
  getWorkspaceByName: (name: string) => Workspace | undefined;

  setCurrentWorkspaceId: (workspaceId: string) => void;
}

const defaultWorkspaceId = crypto.randomUUID();

const useTodoStore = create<State & Actions>()(immer((set, get) => ({
  tasks: [],
  workspaces: [{
    name: "Default",
    id: defaultWorkspaceId,
  }],
  defaultWorkspaceId,
  currentWorkspaceId: defaultWorkspaceId,

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

  addWorkspace: (list) => set((state) => {
    state.workspaces.push(list);
  }),

  removeWorkspace: (listId) => set((state) => {
    state.workspaces = state.workspaces.filter(list => list.id !== listId);
    state.tasks = state.tasks.filter(task => task.listId !== listId);
  }),

  updateWorkspace: (listId, updates) => set((state) => {
    const list = state.workspaces.find(list => list.id === listId);
    if (list) {
      Object.assign(list, updates);
    }
  }),
  getWorkspaceById: (listId: string): Workspace | undefined => {
    const state = get();
    return state.workspaces.find((list: Workspace) => list.id === listId);
  },

  getWorkspaceByName: (name: string): Workspace | undefined => {
    const state = get();
    return state.workspaces.find((list: Workspace) => list.name.toLowerCase() === name.toLowerCase());
  },

  setCurrentWorkspaceId: (workspaceId: string) => set((state) => {
    if (state.workspaces.some(list => list.id === workspaceId)) {
      state.currentWorkspaceId = workspaceId;
    } else {
      console.warn(`Workspace with ID ${workspaceId} does not exist`);
    }
  }),
})));

export default useTodoStore;