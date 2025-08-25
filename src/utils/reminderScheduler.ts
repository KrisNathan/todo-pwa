import useTodoStore, { type Task } from "../stores/todoStore";
import { ensureNotificationPermission, showNotification } from "./notifications";

type Timer = {
  id: number;
  key: string; // taskId:pre
};

let timers: Timer[] = [];
let unsubscribeStore: (() => void) | null = null;
let started = false;

const ONE_HOUR_MS = 60 * 60 * 1000;

function getReminderKey(taskId: string) {
  return `${taskId}:pre`;
}

function clearAllTimers() {
  for (const t of timers) clearTimeout(t.id);
  timers = [];
}

function scheduleForTask(task: Task) {
  if (!task.dueDate) return;
  if (task.completed) return;

  const reminderAt = new Date(task.dueDate.getTime() - ONE_HOUR_MS);
  const now = Date.now();
  const key = getReminderKey(task.id);

  // Dev hint: uncomment if you need to inspect scheduling
  // console.debug('[reminder] schedule', { title: task.title, due: task.dueDate, reminderAt: new Date(reminderAt), now: new Date(now) });

  const store = useTodoStore.getState();
  if (store.hasReminderBeenNotified(key)) return; // already shown

  // If the reminder time already passed but due date not passed more than 1 hour ago, fire immediately once
  if (reminderAt.getTime() <= now && task.dueDate.getTime() > now) {
    queueMicrotask(async () => {
      const due = task.dueDate!;
      await ensureNotificationPermission();
      await showNotification("Task due soon", {
        body: `"${task.title}" is due at ${due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        tag: key, // dedupe by tag at the OS level
        data: { taskId: task.id, type: "pre" },
        icon: "/pwa-192x192.png",
        badge: "/pwa-64x64.png",
      });
      useTodoStore.getState().markReminderNotified(key);
    });
    return;
  }

  // If the task is already overdue or more than 1h past reminder, skip
  if (task.dueDate.getTime() <= now) return;

  const delay = Math.max(0, reminderAt.getTime() - now);
  // console.debug('[reminder] timer set', { title: task.title, fireInMs: delay });
  const id = window.setTimeout(async () => {
    const stateNow = useTodoStore.getState();
    // Skip if completed or deleted by the time timer fires
    const latest = stateNow.getTaskById(task.id);
    if (!latest || latest.completed) return;
    const firedKey = getReminderKey(task.id);
    if (stateNow.hasReminderBeenNotified(firedKey)) return;

    await ensureNotificationPermission();
    await showNotification("Task due soon", {
  body: `"${latest.title}" is due at ${latest.dueDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      tag: firedKey,
      data: { taskId: latest.id, type: "pre" },
      icon: "/pwa-192x192.png",
      badge: "/pwa-64x64.png",
    });
    stateNow.markReminderNotified(firedKey);
  }, delay);

  timers.push({ id, key });
}

function rescheduleAll() {
  clearAllTimers();
  const { tasks } = useTodoStore.getState();
  for (const t of tasks) scheduleForTask(t);
}

export function startReminderScheduler() {
  if (started) return;
  started = true;

  // Initial pass
  rescheduleAll();

  // Re-run when store changes
  unsubscribeStore = useTodoStore.subscribe(() => rescheduleAll());

  // Re-evaluate when tab gains visibility (timers may be throttled in background)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      rescheduleAll();
    }
  });
}

export function stopReminderScheduler() {
  unsubscribeStore?.();
  unsubscribeStore = null;
  clearAllTimers();
  started = false;
}
