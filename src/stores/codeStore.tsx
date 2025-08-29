import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { mnemonicToSeedSync } from '@scure/bip39';
import { HDKey } from '@scure/bip32';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';
import { encryptJson, decryptJson } from '../utils/crypto';
import SyncSchedulerInitTask from '../init_task/sync_scheduler';

// Small helper to hex-encode Uint8Array
const bytesToHex = (bytes: Uint8Array) => [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');

// Derive a deterministic secp256k1 keypair from a mnemonic using BIP32 at a fixed path
const deriveKeysFromMnemonic = (mnemonic: string) => {
  const seed = mnemonicToSeedSync(mnemonic);
  const hd = HDKey.fromMasterSeed(seed);
  // Fixed derivation path to ensure the same mnemonic always yields the same keys
  const child = hd.derive("m/44'/0'/0'/0/0");
  if (!child.privateKey || !child.publicKey) {
    throw new Error('Failed to derive keys from mnemonic');
  }
  return {
    privateKey: bytesToHex(child.privateKey),
    publicKey: bytesToHex(child.publicKey), // compressed public key
  };
};

// IndexedDB-backed storage for zustand/persist (stores JSON strings)
const idbStorage: StateStorage = {
  getItem: async (name) => (await idbGet<string | null>(name)) ?? null,
  setItem: async (name, value) => { await idbSet(name, value); },
  removeItem: async (name) => { await idbDel(name); },
};

type State = {
  syncCode?: string;
  deviceName?: string;
  privateKey?: string;
  publicKey?: string;
}

type Actions = {
  generateSyncCode: () => string;
  setSyncCode: (code: string) => void;
  setDeviceName: (name: string) => void;
  exitSyncChain: () => void;
}

const useCodeStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      syncCode: undefined,
      deviceName: undefined,

      generateSyncCode: () => {
        // Generate a random sync code (24 words)
        const code = generateMnemonic(wordlist, 256);

        const { privateKey, publicKey } = deriveKeysFromMnemonic(code);

        set((state) => {
          state.syncCode = code;

          state.privateKey = privateKey;
          state.publicKey = publicKey;

          const testJson = {
            tasks: [
              { name: "amogus" },
            ]
          };

          (async () => {
            console.log("Testing encryption/decryption with ECDSA signatures...");
            const encrypted = await encryptJson(testJson, privateKey);
            const decrypted = await decryptJson(encrypted, privateKey, publicKey);
            console.log('Encrypted:', encrypted);
            console.log('Decrypted:', decrypted);
          })();
        });

        SyncSchedulerInitTask.start();

        return code;
      },
      setSyncCode: (code) => set((state) => {
        try {
          const { privateKey, publicKey } = deriveKeysFromMnemonic(code);
          state.privateKey = privateKey;
          state.publicKey = publicKey;
          state.syncCode = code;

          SyncSchedulerInitTask.start();
        } catch {
          // If invalid mnemonic, leave keys undefined
          state.privateKey = undefined;
          state.publicKey = undefined;
        }
      }),
      setDeviceName: (name) => set((state) => {
        state.deviceName = name;
      }),

      exitSyncChain: () => set((state) => {
        state.syncCode = undefined;
        state.deviceName = undefined;
        state.privateKey = undefined;
        state.publicKey = undefined;

        SyncSchedulerInitTask.stop();
      }),
    })),
    {
      name: 'code-store',
      version: 1,
      storage: createJSONStorage(() => idbStorage),
    }
  )
);

export default useCodeStore;