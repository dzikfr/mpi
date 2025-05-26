import { generateRandomAlphanumeric } from "./generateRandomAlphanumeric";

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
