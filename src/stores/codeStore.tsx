import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { mnemonicToSeedSync } from '@scure/bip39';
import { HDKey } from '@scure/bip32';
// import { decryptJson, encryptJson } from '../utils/crypto';

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
}

const useCodeStore = create<State & Actions>()(immer((set) => ({
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

      // const testJson = JSON.stringify({
      //   tasks: [
      //     { name: "amogus" },
      //   ]
      // });

      // (async () => {
      //   const encrypted = await encryptJson(testJson, privateKey, publicKey);
      //   const decrypted = await decryptJson(encrypted, privateKey);
      //   console.log(encrypted);
      //   console.log(decrypted);
      // })();
    });

    return code;
  },
  setSyncCode: (code) => set((state) => {
    state.syncCode = code;
    try {
      const { privateKey, publicKey } = deriveKeysFromMnemonic(code);
      state.privateKey = privateKey;
      state.publicKey = publicKey;
    } catch {
      // If invalid mnemonic, leave keys undefined
      state.privateKey = undefined;
      state.publicKey = undefined;
    }
  }),
  setDeviceName: (name) => set((state) => {
    state.deviceName = name;
  }),
})));

export default useCodeStore;