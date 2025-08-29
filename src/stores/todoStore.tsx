import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Task } from '../interfaces/task';
import type { Workspace } from '../interfaces/workspace';
import Database from '../repository/database';

const DEFAULT_WORKSPACE_ID = 'default-workspace-id';
const DEFAULT_WORKSPACE_NAME = 'Default';

// Local helper to lazily initialize the DB instance
let dbInstance: Database | null = null;
const getDB = async () => {
  if (!dbInstance) dbInstance = await Database.init();
  return dbInstance;
};

type State = {
  tasks: Task[];
  workspaces: Workspace[];
  defaultWorkspaceId: string;
  currentWorkspaceId: string;
  // Keys of reminders we've already shown to avoid duplicate notifications across reloads
  notifiedReminderKeys: string[];
  hydrated: boolean; // true when loaded from IndexedDB
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
  // Load tasks/workspaces from IndexedDB
  init: () => Promise<void>;
}


const useTodoStore = create<State & Actions>()(
  immer((set, get) => ({
    tasks: [],
    workspaces: [{ name: DEFAULT_WORKSPACE_NAME, id: DEFAULT_WORKSPACE_ID }],
    defaultWorkspaceId: DEFAULT_WORKSPACE_ID,
    currentWorkspaceId: DEFAULT_WORKSPACE_ID,
    notifiedReminderKeys: [],
    hydrated: false,

    addTask: (task, taskIdOverride) => set((state) => {
      const newTask: Task = {
        ...task,
        id: taskIdOverride ? taskIdOverride : crypto.randomUUID(),
      };
      state.tasks.push(newTask);
      // Persist
      void getDB().then((db) => db.addTask(newTask)).catch(console.error);
    }),

    removeTask: (taskId) => set((state) => {
      state.tasks = state.tasks.filter(task => task.id !== taskId);
      state.notifiedReminderKeys = state.notifiedReminderKeys.filter(k => !k.startsWith(`${taskId}:`));
      void getDB().then((db) => db.removeTask(taskId)).catch(console.error);
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
        void getDB().then((db) => db.updateTask(taskId, updates)).catch(console.error);
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
      void getDB().then((db) => db.addWorkspace(list)).catch(console.error);
    }),

    removeWorkspace: (listId) => set((state) => {
      // Prevent removing the default workspace
      if (listId === state.defaultWorkspaceId) {
        console.warn('Cannot remove the default workspace');
        return;
      }
      state.workspaces = state.workspaces.filter(list => list.id !== listId);
      state.tasks = state.tasks.filter(task => task.listId !== listId);
      // If current workspace is removed, fall back to default
      if (state.currentWorkspaceId === listId) {
        state.currentWorkspaceId = state.defaultWorkspaceId;
      }
      void getDB().then((db) => db.removeWorkspace(listId)).catch(console.error);
    }),

    updateWorkspace: (listId, updates) => set((state) => {
      const list = state.workspaces.find(list => list.id === listId);
      if (list) {
        Object.assign(list, updates);
        void getDB().then((db) => db.updateWorkspace(listId, updates)).catch(console.error);
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

        void getDB().then((db) => db.setCurrentWorkspaceId(workspaceId)).catch(console.error);
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

    init: async () => {
      const db = await getDB();
      
      const [tasksFromDb, workspacesFromDb] = await Promise.all([
        db.getAllTasks(),
        db.getAllWorkspaces(),
      ]);

      // Normalize dueDate if it came back as string (defensive)
      const tasks: Task[] = []
      for (const t of tasksFromDb) {
        let dueDate: Date | null = null;
        if (t.dueDate) {
          dueDate = new Date(t.dueDate as unknown as string | number | Date);
          if (0 === dueDate.getTime()) {
            dueDate = null;
          }
        }
        tasks.push({
          ...t,
          dueDate,
        });
      }

      // Initialize workspaces
      let workspaces = workspacesFromDb.slice();
      if (workspaces.length === 0) {
        const defaultWs: Workspace = { id: DEFAULT_WORKSPACE_ID, name: DEFAULT_WORKSPACE_NAME };
        workspaces = [defaultWs];
        // Persist default workspace
        await db.addWorkspace(defaultWs);
      }

      // Pick a stable default: the workspace named "Default" if present; else first
      const defaultWs = workspaces.find(w => w.name.toLowerCase() === 'default') ?? workspaces[0];
      const nextDefaultId = defaultWs.id;

      // Load currentWorkspaceId from DB and validate
      let currentWorkspaceId = await db.getCurrentWorkspaceId();
      if (!currentWorkspaceId) {
        currentWorkspaceId = nextDefaultId;
      }
      if (!workspaces.some(w => w.id === currentWorkspaceId)) {
        void getDB().then((db) => db.setCurrentWorkspaceId(nextDefaultId)).catch(console.error);
        currentWorkspaceId = nextDefaultId;
      }
      

      set((state) => {
        state.tasks = tasks;
        state.workspaces = workspaces;
        state.defaultWorkspaceId = nextDefaultId;
        state.currentWorkspaceId = currentWorkspaceId;
        state.hydrated = true;
      });
    },
  }))
);

export default useTodoStore;