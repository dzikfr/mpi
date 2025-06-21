import crypto from "crypto-js";

const SECRET_KEY = process.env.SECRET_KEY || "KEY_32_BYTE_PENTING";

export const secureSet = (key: string, data: any) => {
  const stringified = JSON.stringify(data);
  const encrypted = crypto.AES.encrypt(stringified, SECRET_KEY).toString();
  localStorage.setItem(key, encrypted);
}

export const secureGet = (key: string): any | null =>{
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;

  try {
    const bytes = crypto.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(crypto.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    console.error("Decryption failed:", e);
    return null;
  }
}

export const secureRemove = (key: string) => {
  localStorage.removeItem(key);
}
