// Utilities for encrypting/decrypting JSON payloads in the browser using Web Crypto
// - Key derivation: HKDF-SHA256 from the deterministic privateKey (hex)
// - Encryption: AES-GCM with per-message random salt and iv
// - Binding: use publicKey as HKDF info and AAD to bind ciphertexts to a sync chain

const te = new TextEncoder();
const td = new TextDecoder();

const hexToBytes = (hex: string): Uint8Array => {
  if (hex.startsWith('0x')) hex = hex.slice(2);
  if (hex.length % 2 !== 0) throw new Error('Invalid hex string');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
};

const bytesToBase64 = (buf: Uint8Array): string => btoa(String.fromCharCode(...buf));
const base64ToBytes = (b64: string): Uint8Array => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

async function deriveAesKey(privateKeyHex: string, salt: Uint8Array, info: Uint8Array): Promise<CryptoKey> {
  const raw = hexToBytes(privateKeyHex); // 32 bytes
  const baseKey = await crypto.subtle.importKey('raw', raw, 'HKDF', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt, info },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

function buildInfo(publicKeyHex: string): Uint8Array {
  const label = new TextEncoder().encode('todo-sync:v1');
  const pub = hexToBytes(publicKeyHex);
  const info = new Uint8Array(label.length + pub.length);
  info.set(label, 0);
  info.set(pub, label.length);
  return info;
}

export type EncryptedPackage = {
  v: 1;
  alg: 'AES-GCM-256/HKDF-SHA256';
  publicKey: string;
  salt: string;
  iv: string;
  aad: string;
  ct: string;
};

export async function encryptJson(payload: unknown, privateKeyHex: string, publicKeyHex: string): Promise<EncryptedPackage> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const info = buildInfo(publicKeyHex);
  const key = await deriveAesKey(privateKeyHex, salt, info);
  const aad = hexToBytes(publicKeyHex); // bind ciphertext to chain id
  const plaintext = te.encode(JSON.stringify(payload));
  const ctBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: aad, tagLength: 128 },
    key,
    plaintext,
  );
  const ct = new Uint8Array(ctBuf);
  return {
    v: 1,
    alg: 'AES-GCM-256/HKDF-SHA256',
    publicKey: publicKeyHex,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    aad: bytesToBase64(aad),
    ct: bytesToBase64(ct),
  };
}

export async function decryptJson<T = unknown>(pkg: EncryptedPackage, privateKeyHex: string): Promise<T> {
  const salt = base64ToBytes(pkg.salt);
  const iv = base64ToBytes(pkg.iv);
  const aad = base64ToBytes(pkg.aad);
  const info = buildInfo(pkg.publicKey);
  const key = await deriveAesKey(privateKeyHex, salt, info);
  const ct = base64ToBytes(pkg.ct);
  const ptBuf = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, additionalData: aad, tagLength: 128 },
    key,
    ct,
  );
  return JSON.parse(td.decode(new Uint8Array(ptBuf))) as T;
}
