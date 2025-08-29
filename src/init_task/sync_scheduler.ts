import SyncUtils from "../utils/sync";
import useTodoStore from "../stores/todoStore";

const PULL_INTERVAL_MS = Number(import.meta.env.VITE_SYNC_PULL_INTERVAL_MS ?? 2 * 60 * 1000); // 2 minutes


export default class SyncSchedulerInitTask {
  static started = false;

  static pullTimer: number | null = null;

  static async start() {
    if (this.started) return;

    await useTodoStore.getState().init();
    // initial sync after store is ready here

    try {
      const sync = new SyncUtils();

      // Ensure sync operations don't overlap: serialize push/pull via a simple promise chain
      let syncChain: Promise<void> = Promise.resolve();
      function queueSync<T>(op: () => Promise<T>): Promise<T> {
        const run = () => op();
        const p = syncChain.then(run);
        // Keep the chain as Promise<void> regardless of op result and swallow errors to not block the chain
        syncChain = p.then(
          () => undefined,
          () => undefined,
        );
        return p;
      }

      // Helper: simple debounce
      function debounce<T extends unknown[]>(fn: (...args: T) => void, ms: number) {
        let t: number | undefined;
        return (...args: T) => {
          if (t) window.clearTimeout(t);
          t = window.setTimeout(() => fn(...args), ms);
        };
      }

      const debouncedPush = debounce<void[]>(() => {
        // Skip if store not hydrated for any reason
        if (!useTodoStore.getState().hydrated) return;
        void queueSync(() => sync.push()).catch(console.error);
      }, 1200);

      const debouncedPull = debounce<void[]>(() => {
        if (!useTodoStore.getState().hydrated) return;
        if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) return;
        void queueSync(() => sync.pull()).catch(() => { });
      }, 400);


      // 1) Initial pull/push sequence
      const pullResult = await queueSync(() => sync.pull()).catch(() => 'not-found');
      if (pullResult === 'not-found') {
        await queueSync(() => sync.push()).catch(console.error);
      } else {
        await queueSync(() => sync.push()).catch(console.error);
      }

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
          debouncedPush();
        }
      }
      useTodoStore.subscribe(onStateChange);


      const onPullInterval = () => {
        if (false === this.started) return;
        if (!useTodoStore.getState().hydrated) return;
        if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) return;

        void queueSync(() => sync.pull()).catch(() => { });
      }

      const onVisibility = () => {
        if (false === this.started) return;
        if ('visible' !== document.visibilityState) return;

        debouncedPull();
      };

      const onFocus = () => {
        if (false === this.started) return;
        debouncedPull()
      };


      this.pullTimer = window.setInterval(onPullInterval, PULL_INTERVAL_MS);
      document.addEventListener('visibilitychange', onVisibility);
      window.addEventListener('focus', onFocus);

      // Clean up timer if the page is being closed/refreshed
      window.addEventListener('beforeunload', () => {
        window.clearInterval(this.pullTimer!);
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('focus', onFocus);
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

    this.started = false;
  }
}
