// utils/indexedDB.js
import { openDB } from "idb";

const DB_NAME = "ChatApp";
const STORE_NAME = "Messages";

export const initDB = async () => {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const saveMessages = async (channelId, messages) => {
  const db = await initDB();
  await db.put(STORE_NAME, messages, channelId);
};

export const getMessages = async (channelId) => {
  const db = await initDB();
  return await db.get(STORE_NAME, channelId);
};
