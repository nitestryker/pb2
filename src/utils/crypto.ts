/**
 * Zero-Knowledge Encryption Utilities
 * Implements AES-GCM encryption for client-side paste encryption
 */

// Convert string to ArrayBuffer
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Convert ArrayBuffer to string
function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

// Convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate a random encryption key
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

// Export key to base64 string for URL fragment
export async function exportKeyToString(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
}

// Import key from base64 string
export async function importKeyFromString(keyString: string): Promise<CryptoKey> {
  const keyBuffer = base64ToArrayBuffer(keyString);
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

// Encrypt content with AES-GCM
export async function encryptContent(content: string, key: CryptoKey): Promise<{
  encryptedData: string;
  iv: string;
}> {
  // Generate a random IV (Initialization Vector)
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
  
  // Encrypt the content
  const contentBuffer = stringToArrayBuffer(content);
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    contentBuffer
  );
  
  return {
    encryptedData: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv.buffer),
  };
}

// Decrypt content with AES-GCM
export async function decryptContent(
  encryptedData: string,
  iv: string,
  key: CryptoKey
): Promise<string> {
  try {
    const encryptedBuffer = base64ToArrayBuffer(encryptedData);
    const ivBuffer = base64ToArrayBuffer(iv);
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer,
      },
      key,
      encryptedBuffer
    );
    
    return arrayBufferToString(decryptedBuffer);
  } catch (error) {
    throw new Error('Failed to decrypt content. Invalid key or corrupted data.');
  }
}

// Utility to extract key from URL fragment
export function extractKeyFromUrl(): string | null {
  const hash = window.location.hash;
  if (hash.startsWith('#')) {
    return hash.substring(1);
  }
  return null;
}

// Utility to add key to URL fragment
export function addKeyToUrl(key: string): string {
  const currentUrl = window.location.href.split('#')[0];
  return `${currentUrl}#${key}`;
}

// Validate if Web Crypto API is available
export function isWebCryptoSupported(): boolean {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined' &&
         typeof crypto.subtle.generateKey === 'function';
}