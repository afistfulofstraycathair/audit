// Simple encryption utilities for sensitive audit data
// Note: This is basic client-side encryption. For production, use proper server-side encryption

class SimpleEncryption {
  private static readonly key = "audit_app_2024"; // In production, use proper key management

  static encrypt(text: string): string {
    try {
      // Simple XOR encryption (for demonstration - use proper encryption in production)
      let result = "";
      for (let i = 0; i < text.length; i++) {
        const charCode =
          text.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length);
        result += String.fromCharCode(charCode);
      }
      return btoa(result); // Base64 encode
    } catch (error) {
      console.error("Encryption failed:", error);
      return text; // Return original if encryption fails
    }
  }

  static decrypt(encryptedText: string): string {
    try {
      const decoded = atob(encryptedText); // Base64 decode
      let result = "";
      for (let i = 0; i < decoded.length; i++) {
        const charCode =
          decoded.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      console.error("Decryption failed:", error);
      return encryptedText; // Return encrypted if decryption fails
    }
  }

  static shouldEncrypt(field: string): boolean {
    // Define which fields should be encrypted
    const sensitiveFields = [
      "auditeeName",
      "auditeeAddress",
      "auditorName",
      "auditorAddress",
      "auditeeContactName",
      "qualityAuditorNames",
      "notes",
      "observationCategory",
    ];
    return sensitiveFields.includes(field);
  }
}

// Enhanced storage with encryption
export class SecureStorage {
  static setItem(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      const encrypted = SimpleEncryption.encrypt(serialized);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Secure storage write failed:", error);
      // Fallback to regular storage
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static getItem(key: string): any {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      // Try to decrypt first
      try {
        const decrypted = SimpleEncryption.decrypt(encrypted);
        return JSON.parse(decrypted);
      } catch {
        // If decryption fails, try parsing as regular JSON (backward compatibility)
        return JSON.parse(encrypted);
      }
    } catch (error) {
      console.error("Secure storage read failed:", error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}

// Hash function for data integrity
export function simpleHash(data: string): string {
  let hash = 0;
  if (data.length === 0) return hash.toString();

  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// Data sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim();
}

// Generate secure random ID
export function generateSecureId(): string {
  const array = new Uint8Array(16);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for older browsers
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

export default SimpleEncryption;
