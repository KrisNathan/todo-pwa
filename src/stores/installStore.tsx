import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}


type State = {
  isInstalled: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

type Actions = {
  setIsInstalled: (installed: boolean) => void;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  handleInstallClick: () => Promise<void>;
}

const useInstallStore = create<State & Actions>()(immer((set, get) => ({
  isInstalled: false,
  deferredPrompt: null,

  setIsInstalled: (installed) => set((state) => {
    state.isInstalled = installed;
  }),
  
  setDeferredPrompt: (prompt) => set((state) => {
    state.deferredPrompt = prompt;
  }),

  handleInstallClick: async () => {
    const { deferredPrompt } = get();
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      set((state) => {
        state.deferredPrompt = null;
        state.isInstalled = true;
      });
    } else {
      console.log('User dismissed the install prompt');
    }
  },
})));

export default useInstallStore;