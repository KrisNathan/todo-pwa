import { decryptJson, encryptJson } from "./crypto";
import { z } from "zod";
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

// Zod schemas to validate and normalize remote payloads
const SerializedTaskSchema = z
  .object({
    id: z.string().trim().catch(""),
    title: z.string().catch(""),
    completed: z.boolean().catch(false),
    isImportant: z.boolean().catch(false),
    listId: z.string().catch(""),
    // Accept ISO strings or null; normalize undefined/empty to null
    dueDate: z
      .preprocess((v: unknown) => {
        if (v === undefined || v === null || v === "") return null;
        if (typeof v === "string") return v;
        return null;
      }, z.string().datetime().or(z.null()))
      .catch(null),
  })
  .strip();

const SerializedWorkspaceSchema = z
  .object({
    id: z.string().trim().catch(""),
    name: z.string().catch(""),
  })
  .strip();

const EncryptedPayloadSchema: z.ZodType<EncryptedPayload> = z
  .object({
    tasks: z.array(SerializedTaskSchema).default([]).catch([]),
    workspaces: z.array(SerializedWorkspaceSchema).default([]).catch([]),
  })
  .strip();

export default class SyncUtils {
  constructor() { }

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
    const parsed = EncryptedPayloadSchema.safeParse(obj ?? {});
    if (!parsed.success) {
      throw new Error("Invalid payload");
    }
    const { tasks, workspaces } = parsed.data;
    return {
      tasks: tasks.filter((t: SerializedTask) => t.id),
      workspaces: workspaces.filter((w: SerializedWorkspace) => w.id),
    };
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
    for (const remoteTask of remote.tasks) {
      const localTask = localTasksById.get(remoteTask.id);
      const due = remoteTask.dueDate ? new Date(remoteTask.dueDate) : null;
      if (!localTask) {
        useTodoStore.getState().addTask(
          {
            title: remoteTask.title,
            completed: remoteTask.completed,
            isImportant: remoteTask.isImportant,
            listId: remoteTask.listId,
            dueDate: due,
          },
          remoteTask.id
        );
      } else {
        // Update if any field differs
        const differs =
          localTask.title !== remoteTask.title ||
          localTask.completed !== remoteTask.completed ||
          localTask.isImportant !== remoteTask.isImportant ||
          localTask.listId !== remoteTask.listId ||
          ((localTask.dueDate?.getTime() ?? -1) !== (due ? due.getTime() : -1));
        if (differs) {
          useTodoStore.getState().updateTask(remoteTask.id, {
            title: remoteTask.title,
            completed: remoteTask.completed,
            isImportant: remoteTask.isImportant,
            listId: remoteTask.listId,
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