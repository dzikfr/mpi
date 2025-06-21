import { generateRandomAlphanumeric } from "./generateRandomAlphanumeric";
import crypto from "crypto";

export const hashId = (id: string): string => {
  const id1 = id.substring(0, id.length - 5);
  const id2 = "-" + generateRandomAlphanumeric(4);
  const id3 = id.substring(id.length - 5);

  const newId = id1 + id2 + id3;
  const hashedId = Buffer.from(newId).toString("base64");

  return hashedId;
};

export const originalId = (hashed: string): string => {
  const decoded = Buffer.from(hashed, "base64").toString("utf-8");

  const id1 = decoded.substring(0, decoded.length - 10);
  const id2 = decoded.substring(decoded.length - 5);

  return id1 + id2;
};

export const bulkHashId = (obj: Record<string, any>): object => {
  const hashed: Record<string, any> = {};
  for (const key in obj) {
    if (key.endsWith("_id") && obj[key]) {
      hashed[key] = hashId(obj[key]);
    }
  }
  return { ...obj, ...hashed };
};

export const deepBulkHashId = (data: Record<string, any>): object => {
  if (Array.isArray(data)) {
    return data.map(deepBulkHashId);
  } else if (data && typeof data === "object" && !(data instanceof Date)) {
    const hashed: Record<string, any> = {};
    for (const key in data) {
      const value = data[key];

      if (key.endsWith("_id") && typeof value === "string") {
        hashed[key] = hashId(value);
      } else if (Array.isArray(value)) {
        hashed[key] = value.map(deepBulkHashId);
      } else if (
        value &&
        typeof value === "object" &&
        !(value instanceof Date)
      ) {
        hashed[key] = deepBulkHashId(value);
      } else {
        hashed[key] = value;
      }
    }
    return hashed;
  } else {
    return data;
  }
};

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  ? Buffer.from(process.env.ENCRYPTION_KEY, "hex")
  : crypto.randomBytes(32);
const IV_LENGTH = 16;

export const encryptId = (id: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(id.toString(), "utf8", "base64");
  encrypted += cipher.final("base64");

  const result = iv.toString("base64") + ":" + encrypted;
  return result.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const decryptId = (encrypted: string): string => {
  const parts = encrypted.replace(/-/g, "+").replace(/_/g, "/").split(":");
  const iv = Buffer.from(parts[0], "base64");
  const encryptedText = Buffer.from(parts[1], "base64");

  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText, undefined, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

export const deepBulkEncryptId = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(deepBulkEncryptId);
  } else if (data && typeof data === "object" && !(data instanceof Date)) {
    const encrypted: { [key: string]: any } = {};
    for (const key in data) {
      const value = data[key];

      if (key.endsWith("_id") && typeof value === "string") {
        encrypted[key] = encryptId(value);
      } else if (Array.isArray(value)) {
        encrypted[key] = value.map(deepBulkEncryptId);
      } else if (value && typeof value === "object") {
        encrypted[key] = deepBulkEncryptId(value);
      } else {
        encrypted[key] = value;
      }
    }
    return encrypted;
  } else {
    return data;
  }
};
