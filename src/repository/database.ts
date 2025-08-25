// Honestly it doesn't make any sense to have a repository layer over idb, but I'm doing it for the sake of architecture practice.

// Is it even possible to have an adapter for idb? It seems like the API is too low-level for that.

import { openDB, type IDBPDatabase } from "idb";
import type { Task } from "../interfaces/task";
import type { Workspace } from "../interfaces/workspace";

export default class Database {
  private db: IDBPDatabase;
  constructor(db: IDBPDatabase) {
    this.db = db;
  }
  static async init() {
    // Version 2: add listId index for tasks (no legacy data migration)
    const db = await openDB("todo-db", 2, {
      async upgrade(db) {
        // v1 baseline
        if (!db.objectStoreNames.contains("tasks")) {
          const tasksStore = db.createObjectStore("tasks", { keyPath: "id" });
          tasksStore.createIndex("dueDate", "dueDate");
          tasksStore.createIndex("listId", "listId");
        }
        if (!db.objectStoreNames.contains("workspaces")) {
          db.createObjectStore("workspaces", { keyPath: "id" });
        }
      },
    });
    return new Database(db);
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.db.getAll("tasks");
  }
  async getAllWorkspaces(): Promise<Workspace[]> {
    return await this.db.getAll("workspaces");
  }

  async addTask(task: Task) {
    if (null === task.dueDate) {
      task = { ...task, dueDate: new Date(0) };
    }
    const tx = this.db.transaction("tasks", "readwrite");
    await tx.store.add(task);
    await tx.done;
  }
  async removeTask(taskId: string) {
    const tx = this.db.transaction("tasks", "readwrite");
    await tx.store.delete(taskId);
    await tx.done;
  }
  async updateTask(taskId: string, updates: Partial<Task>) {
    if (null === updates.dueDate) {
      updates = { ...updates, dueDate: new Date(0) };
    }

    const tx = this.db.transaction("tasks", "readwrite");
    const task = await tx.store.get(taskId);
    if (!task) throw new Error("Task not found");
    const updated = { ...task, ...updates };
    await tx.store.put(updated);
    await tx.done;
  }

  async addWorkspace(workspace: Workspace) {
    const tx = this.db.transaction("workspaces", "readwrite");
    await tx.store.add(workspace);
    await tx.done;
  }
  async removeWorkspace(workspaceId: string) {
    // Also delete all tasks in this workspace
    // select * from tasks where workspaceId = ?
    const taskTx = this.db.transaction("tasks", "readwrite");
    // We index by listId now
    const index = taskTx.store.index("listId");
    const taskIds = await index.getAllKeys(workspaceId);
    for (const taskId of taskIds) {
      await taskTx.store.delete(taskId);
    }
    await taskTx.done;

    const tx = this.db.transaction("workspaces", "readwrite");
    await tx.store.delete(workspaceId);
    await tx.done;
  }
  async updateWorkspace(workspaceId: string, updates: Partial<Workspace>) {
    const tx = this.db.transaction("workspaces", "readwrite");
    const workspace = await tx.store.get(workspaceId);
    if (!workspace) throw new Error("Workspace not found");
    const updated = { ...workspace, ...updates };
    await tx.store.put(updated);
    await tx.done;
  }
}
