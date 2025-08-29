import { decryptJson, encryptJson } from "./crypto";
import type { Task } from "../interfaces/task";
import type { Workspace } from "../interfaces/workspace";
import useTodoStore from "../stores/todoStore";
import useCodeStore from "../stores/codeStore";

const SYNC_SERVER_URL: string = (import.meta.env.VITE_SYNC_SERVER_URL as string | undefined) ?? "/api/sync";

interface PullResultDTO {
  message: string;
  data: {
    encryptedString: string;
    createdAt: string;
  } | null;
}

interface PushResultDTO {
  message: string;
}

type SerializedTask = Omit<Task, "dueDate"> & { dueDate: string | null };
type SerializedWorkspace = Workspace;

interface EncryptedPayload {
  tasks: SerializedTask[];
  workspaces: SerializedWorkspace[];
}

export default class SyncUtils {
  constructor() {}

  private getKeys() {
    const { publicKey, privateKey } = useCodeStore.getState();
    if (!publicKey || !privateKey) {
      throw new Error("Missing keypair in codeStore (publicKey/privateKey)");
    }
    return { publicKey, privateKey };
  }

  private serializeState(): EncryptedPayload {
    const state = useTodoStore.getState();
    const tasks: SerializedTask[] = state.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
      isImportant: t.isImportant,
      listId: t.listId,
      dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : null,
    }));
    const workspaces: SerializedWorkspace[] = state.workspaces.map((w) => ({ id: w.id, name: w.name }));
    return { tasks, workspaces };
  }

  private parsePayload(obj: unknown): EncryptedPayload {
    if (!obj || typeof obj !== "object") throw new Error("Invalid payload");
    const rec = obj as Record<string, unknown>;
    const tasksRaw = Array.isArray(rec.tasks) ? (rec.tasks as unknown[]) : [];
    const workspacesRaw = Array.isArray(rec.workspaces) ? (rec.workspaces as unknown[]) : [];

    const normTasks: SerializedTask[] = tasksRaw.map((t) => {
      if (t && typeof t === "object") {
        const r = t as Record<string, unknown>;
        const dueVal = r.dueDate;
        return {
          id: String(r.id ?? ""),
          title: String(r.title ?? ""),
          completed: Boolean(r.completed),
          isImportant: Boolean(r.isImportant),
          listId: String(r.listId ?? ""),
          dueDate: typeof dueVal === "string" ? dueVal : null,
        };
      }
      return {
        id: "",
        title: "",
        completed: false,
        isImportant: false,
        listId: "",
        dueDate: null,
      };
    });

    const normWorkspaces: SerializedWorkspace[] = workspacesRaw.map((w) => {
      if (w && typeof w === "object") {
        const r = w as Record<string, unknown>;
        return {
          id: String(r.id ?? ""),
          name: String(r.name ?? ""),
        };
      }
      return { id: "", name: "" };
    });

    return { tasks: normTasks.filter((t) => t.id), workspaces: normWorkspaces.filter((w) => w.id) };
  }

  private async mergeRemoteIntoLocal(remote: EncryptedPayload) {
    const store = useTodoStore.getState();

    // Build lookup maps
    const localTasksById = new Map(store.tasks.map((t) => [t.id, t] as const));
    const localWsById = new Map(store.workspaces.map((w) => [w.id, w] as const));

    // 1) Upsert workspaces from remote
    for (const rw of remote.workspaces) {
      const lw = localWsById.get(rw.id);
      if (!lw) {
        useTodoStore.getState().addWorkspace({ id: rw.id, name: rw.name });
      } else if (lw.name !== rw.name) {
        useTodoStore.getState().updateWorkspace(rw.id, { name: rw.name });
      }
    }

  // 2) Do NOT remove local workspaces missing from remote (local retains extras)

    // 3) Upsert tasks from remote
    for (const rt of remote.tasks) {
      const lt = localTasksById.get(rt.id);
      const due = rt.dueDate ? new Date(rt.dueDate) : null;
      if (!lt) {
        useTodoStore.getState().addTask(
          {
            title: rt.title,
            completed: rt.completed,
            isImportant: rt.isImportant,
            listId: rt.listId,
            dueDate: due,
          },
          rt.id
        );
      } else {
        // Update if any field differs
        const differs =
          lt.title !== rt.title ||
          lt.completed !== rt.completed ||
          lt.isImportant !== rt.isImportant ||
          lt.listId !== rt.listId ||
          ((lt.dueDate?.getTime() ?? -1) !== (due ? due.getTime() : -1));
        if (differs) {
          useTodoStore.getState().updateTask(rt.id, {
            title: rt.title,
            completed: rt.completed,
            isImportant: rt.isImportant,
            listId: rt.listId,
            dueDate: due,
          });
        }
      }
    }

  // 4) Do NOT remove local tasks missing from remote (local retains extras)
  }

  async pull(): Promise<"ok" | "not-found"> {
    const { publicKey, privateKey } = this.getKeys();
    const result = await fetch(`${SYNC_SERVER_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": publicKey,
      },
      credentials: "include",
    });

    if (result.status === 404) {
      // No remote data yet
      return "not-found";
    }
    if (!result.ok) {
      const text = await result.text().catch(() => result.statusText);
      throw new Error(`Failed to pull sync data: ${result.status} ${text}`);
    }
    const data = (await result.json()) as PullResultDTO;
    if (!data.data) return "not-found";

    const decrypted = await decryptJson(data.data.encryptedString, privateKey, publicKey);
    const payload = this.parsePayload(decrypted);
    await this.mergeRemoteIntoLocal(payload);
    return "ok";
  }

  async push(): Promise<PushResultDTO> {
    const { publicKey, privateKey } = this.getKeys();
    const payload = this.serializeState();
    const encryptedString = await encryptJson(payload, privateKey);

    const result = await fetch(`${SYNC_SERVER_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": publicKey,
      },
      credentials: "include",
      body: JSON.stringify({
        encryptedString,
        createdAt: new Date().toISOString(),
      }),
    });
    if (!result.ok) {
      const text = await result.text().catch(() => result.statusText);
      throw new Error(`Failed to push sync data: ${result.status} ${text}`);
    }
    const data = (await result.json()) as PushResultDTO;
    return data;
  }
}