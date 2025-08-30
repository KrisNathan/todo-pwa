import SyncUtils from "../utils/sync";
import useTodoStore from "../stores/todoStore";

const PULL_INTERVAL_MS = Number(import.meta.env.VITE_SYNC_PULL_INTERVAL_MS ?? 2 * 60 * 1000); // 2 minutes

function debounce<T extends unknown[]>(fn: (...args: T) => void, ms: number) {
  let t: number | undefined;
  return (...args: T) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}

export default class SyncSchedulerInitTask {
  static started = false;

  private static sync = new SyncUtils();

  // Ensure sync operations don't overlap: serialize push/pull via a simple promise chain
  private static syncChain: Promise<void> = Promise.resolve();
  private static async queueSync<T>(op: () => Promise<T>): Promise<T> {
    const run = () => op();
    const p = this.syncChain.then(run);
    // Keep the chain as Promise<void> regardless of op result and swallow errors to not block the chain
    this.syncChain = p.then(
      () => undefined,
      () => undefined,
    );
    return p;
  }

  private static debouncedPush = debounce<void[]>(() => {
    // Skip if store not hydrated for any reason
    if (!useTodoStore.getState().hydrated) return;
    void this.queueSync(() => this.sync.push()).catch(console.error);
  }, 1200);

  private static debouncedPull = debounce<void[]>(() => {
    if (!useTodoStore.getState().hydrated) return;
    if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) return;
    void this.queueSync(() => this.sync.pull()).catch(() => { });
  }, 400);


  // event handlers (must be arrow function)
  private static onVisibility = () => {
    if (false === this.started) return;
    if ('visible' !== document.visibilityState) return;

    this.debouncedPull();
  }

  private static onFocus = () => {
    if (false === this.started) return;
    this.debouncedPull()
  }

  static pullTimer: number | null = null;
  static unsubscribeTodoStoreChange: (() => void) | null = null;

  static async start() {
    if (this.started) return;

    await useTodoStore.getState().init();
    // initial sync after store is ready here

    try {
      // 1) Initial pull/push sequence
      const pullResult = await this.queueSync(() => this.sync.pull()).catch(() => 'not-found');
      if (pullResult === 'not-found') {
        await this.queueSync(() => this.sync.push()).catch(console.error);
      } else {
        await this.queueSync(() => this.sync.push()).catch(console.error);
      }

      // 2) Periodic sync etc
      
      const signature = () => {
        const s = useTodoStore.getState();
        // Keep only relevant fields for sync
        const t = s.tasks.map((x) => [
          x.id,
          x.title,
          x.completed,
          x.isImportant,
          x.listId,
          x.dueDate ? new Date(x.dueDate).getTime() : null,
        ]);
        const w = s.workspaces.map((x) => [x.id, x.name]);
        return JSON.stringify({ t, w });
      };
      let prevSig = signature();
      const onStateChange = () => {
        if (false === this.started) return;

        // Only push when tasks/workspaces actually changed
        const nextSig = signature();
        if (nextSig !== prevSig) {
          prevSig = nextSig;
          this.debouncedPush();
        }
      }

      const onPullInterval = () => {
        if (false === this.started) return;
        if (!useTodoStore.getState().hydrated) return;
        if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) return;

        void this.queueSync(() => this.sync.pull()).catch(() => { });
      }

      this.unsubscribeTodoStoreChange = useTodoStore.subscribe(onStateChange);
      this.pullTimer = window.setInterval(onPullInterval, PULL_INTERVAL_MS);
      document.addEventListener('visibilitychange', this.onVisibility);
      window.addEventListener('focus', this.onFocus);

      // Clean up timer if the page is being closed/refreshed
      window.addEventListener('beforeunload', () => {
       this.stop();
      });

      this.started = true;
    } catch (e) {
      // Missing keys or network issues shouldn't block app start
      console.warn('[sync] initial sync skipped:', e);
    }
  }

  static stop() {
    window.clearInterval(this.pullTimer!);
    this.pullTimer = null;

    this.unsubscribeTodoStoreChange?.();
    this.unsubscribeTodoStoreChange = null;

    document.removeEventListener('visibilitychange', this.onVisibility);
    window.removeEventListener('focus', this.onFocus);

    this.started = false;
  }
}
