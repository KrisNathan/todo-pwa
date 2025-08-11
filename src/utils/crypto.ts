// Encrypts and decrypts JSON objects using private keys with ECDSA signature authentication
import { secp256k1 } from '@noble/curves/secp256k1';

// Helper function to convert hex string to Uint8Array
const hexToBytes = (hex: string): Uint8Array => {
  const result = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    result[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return result;
};

// Helper function to convert Uint8Array to base64
const bytesToBase64 = (bytes: Uint8Array): string => {
  return btoa(String.fromCharCode(...bytes));
};

// Helper function to convert base64 to Uint8Array
const base64ToBytes = (base64: string): Uint8Array => {
  return new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
};

// Create ECDSA signature for authentication
const createSignature = async (data: string, privateKeyHex: string): Promise<string> => {
  const dataBytes = new TextEncoder().encode(data);
  const dataHash = await crypto.subtle.digest('SHA-256', dataBytes);
  const privateKeyBytes = hexToBytes(privateKeyHex);
  
  const signature = secp256k1.sign(new Uint8Array(dataHash), privateKeyBytes);
  return signature.toHex();
};

// Derive an AES key from the private key using PBKDF2
const deriveAESKey = async (privateKeyHex: string, salt: Uint8Array): Promise<CryptoKey> => {
  // Use the private key as password material
  const privateKeyBytes = hexToBytes(privateKeyHex);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    privateKeyBytes.buffer as unknown as ArrayBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as unknown as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

export const encryptJson = async (data: object, privateKey: string): Promise<string> => {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data);
    const dataBytes = new TextEncoder().encode(jsonString);

    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Derive AES key from private key
    const aesKey = await deriveAESKey(privateKey, salt);

    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv.buffer as unknown as ArrayBuffer },
      aesKey,
      dataBytes
    );

    // Combine salt, iv, and encrypted data
    const encryptedPayload = {
      salt: bytesToBase64(salt),
      iv: bytesToBase64(iv),
      data: bytesToBase64(new Uint8Array(encryptedData))
    };

    const encryptedPayloadString = JSON.stringify(encryptedPayload);

    // Create ECDSA signature for authentication
    const signature = await createSignature(encryptedPayloadString, privateKey);

    // Final result includes the signature for verification
    const result = {
      payload: encryptedPayloadString,
      signature: signature
    };

    return JSON.stringify(result);
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Verify ECDSA signature
const verifySignature = async (data: string, signature: string, publicKeyHex: string): Promise<boolean> => {
  try {
    const dataBytes = new TextEncoder().encode(data);
    const dataHash = await crypto.subtle.digest('SHA-256', dataBytes);
    const signatureBytes = hexToBytes(signature);
    const publicKeyBytes = hexToBytes(publicKeyHex);
    
    return secp256k1.verify(signatureBytes, new Uint8Array(dataHash), publicKeyBytes);
  } catch {
    return false;
  }
};

export const decryptJson = async (encryptedData: string, privateKey: string, publicKey?: string): Promise<object> => {
  try {
    // Parse the outer structure (payload + signature)
    const outerParsed = JSON.parse(encryptedData);
    
    // For backward compatibility, handle different formats
    let payloadString: string;
    
    if (outerParsed.payload && outerParsed.signature) {
      // New format with ECDSA signature
      payloadString = outerParsed.payload;
      
      // Verify ECDSA signature if public key is provided
      if (publicKey) {
        const isValid = await verifySignature(payloadString, outerParsed.signature, publicKey);
        if (!isValid) {
          throw new Error('ECDSA signature verification failed - data may have been tampered with');
        }
      }
    } else if (outerParsed.payload && outerParsed.authTag) {
      // Old HMAC format (backward compatibility)
      payloadString = outerParsed.payload;
      // Note: Cannot verify HMAC without reimplementing the old function
      console.warn('Using deprecated HMAC format, consider upgrading to ECDSA signatures');
    } else if (outerParsed.salt && outerParsed.iv && outerParsed.data) {
      // Original format without authentication (backward compatibility)
      payloadString = encryptedData;
      console.warn('Using format without authentication, consider upgrading to ECDSA signatures');
    } else {
      throw new Error('Invalid encrypted data format');
    }

    // Parse the encrypted data structure
    const parsed = JSON.parse(payloadString);
    const salt = base64ToBytes(parsed.salt);
    const iv = base64ToBytes(parsed.iv);
    const data = base64ToBytes(parsed.data);

    // Derive the same AES key from private key
    const aesKey = await deriveAESKey(privateKey, salt);

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv.buffer as unknown as ArrayBuffer },
      aesKey,
      data.buffer as unknown as ArrayBuffer
    );

    // Convert back to string and parse JSON
    const jsonString = new TextDecoder().decode(decryptedData);
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};