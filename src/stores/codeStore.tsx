import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type State = {
  syncCode?: string;
  deviceName?: string;
}

type Actions = {
  generateSyncCode: () => string;
  setSyncCode: (code: string) => void;
  setDeviceName: (name: string) => void;
}

const useCodeStore = create<State & Actions>()(immer((set) => ({
  syncCode: undefined,
  deviceName: undefined,

  generateSyncCode: () => {
    // Generate a random sync code (24 words)
    const code = generateMnemonic(wordlist, 256);
    set((state) => {
      state.syncCode = code;
    });
    return code;
  },
  setSyncCode: (code) => set((state) => {
    state.syncCode = code;
  }),
  setDeviceName: (name) => set((state) => {
    state.deviceName = name;
  }),
})));

export default useCodeStore;