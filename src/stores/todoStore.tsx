import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';

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

// IndexedDB-backed storage for zustand/persist (stores JSON strings)
const idbStorage: StateStorage = {
  getItem: async (name) => {
    const v = await idbGet<string | null>(name);
    return v ?? null;
  },
  setItem: async (name, value) => {
    await idbSet(name, value);
  },
  removeItem: async (name) => {
    await idbDel(name);
  },
};

// Only revive the specific date fields we store
const jsonReviver = (key: string, value: unknown) => {
  if (key === 'dueDate' && typeof value === 'string') {
    const d = new Date(value);
    if (!Number.isNaN(d.valueOf())) return d;
  }
  return value;
};

type State = {
  tasks: Task[];
  workspaces: Workspace[];
  defaultWorkspaceId: string;
  currentWorkspaceId: string;
  // Keys of reminders we've already shown to avoid duplicate notifications across reloads
  notifiedReminderKeys: string[];
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

  // Reminder tracking helpers
  hasReminderBeenNotified: (key: string) => boolean;
  markReminderNotified: (key: string) => void;
  clearReminderForTask: (taskId: string) => void;
}

const defaultWorkspaceId = crypto.randomUUID();

const useTodoStore = create<State & Actions>()(
  persist(
    immer((set, get) => ({
      tasks: [],
      workspaces: [{
        name: "Default",
        id: defaultWorkspaceId,
      }],
      defaultWorkspaceId,
      currentWorkspaceId: defaultWorkspaceId,
  notifiedReminderKeys: [],

      addTask: (task, taskIdOverride) => set((state) => {
        const newTask: Task = {
          ...task,
          id: taskIdOverride ? taskIdOverride : crypto.randomUUID(),
        }
        state.tasks.push(newTask);
      }),

      removeTask: (taskId) => set((state) => {
        state.tasks = state.tasks.filter(task => task.id !== taskId);
        state.notifiedReminderKeys = state.notifiedReminderKeys.filter(k => !k.startsWith(`${taskId}:`));
      }),

      updateTask: (taskId, updates) => set((state) => {
        const task = state.tasks.find(task => task.id === taskId);
        if (task) {
          const beforeDue = task.dueDate?.getTime();
          Object.assign(task, updates);
          const afterDue = task.dueDate?.getTime();
          // If due date changed or task toggled completed, clear reminder state
          const dueChanged = beforeDue !== afterDue;
          const completedChanged = typeof updates.completed === 'boolean';
          if (dueChanged || completedChanged) {
            state.notifiedReminderKeys = state.notifiedReminderKeys.filter(k => !k.startsWith(`${taskId}:`));
          }
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
        // Prevent removing the default workspace
        if (listId === state.defaultWorkspaceId) {
          console.warn("Cannot remove the default workspace");
          return;
        }
        
        state.workspaces = state.workspaces.filter(list => list.id !== listId);
        state.tasks = state.tasks.filter(task => task.listId !== listId);
        // If current workspace is removed, fall back to default
        if (state.currentWorkspaceId === listId) {
          state.currentWorkspaceId = state.defaultWorkspaceId;
        }
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

      hasReminderBeenNotified: (key: string) => {
        const state = get();
        return state.notifiedReminderKeys.includes(key);
      },
      markReminderNotified: (key: string) => set((state) => {
        if (!state.notifiedReminderKeys.includes(key)) {
          state.notifiedReminderKeys.push(key);
        }
      }),
      clearReminderForTask: (taskId: string) => set((state) => {
        state.notifiedReminderKeys = state.notifiedReminderKeys.filter(k => !k.startsWith(`${taskId}:`));
      }),
    })),
    {
      name: 'todo-store',
      version: 1,
      storage: createJSONStorage(() => idbStorage, { reviver: jsonReviver }),
      // You can add a migrate function here in future versions
    }
  )
);

export default useTodoStore;