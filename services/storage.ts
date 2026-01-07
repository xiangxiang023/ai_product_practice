
import Dexie, { type Table } from 'https://esm.sh/dexie';
import { ClothingItem, OOTDRecord } from '../types';

// Fix: Use instance-based initialization with type casting to ensure 'version' and table properties are correctly typed.
// This avoids issues where class inheritance from CDN-delivered ESM imports might not resolve types properly.
export const db = new Dexie('ootd_db') as Dexie & {
  clothes: Table<ClothingItem>;
  records: Table<OOTDRecord>;
};

// Schema definition
db.version(1).stores({
  clothes: 'id, category, createdAt',
  records: 'id, date'
});

const THEME_KEY = 'ootd_theme';

export const StorageService = {
  // Clothing Items
  async getClothes(): Promise<ClothingItem[]> {
    return await db.clothes.orderBy('createdAt').reverse().toArray();
  },

  async saveClothing(item: ClothingItem): Promise<void> {
    await db.clothes.put(item);
  },

  async deleteClothing(id: string): Promise<void> {
    await db.clothes.delete(id);
  },

  // OOTD Records
  async getRecords(): Promise<OOTDRecord[]> {
    return await db.records.orderBy('date').reverse().toArray();
  },

  async saveRecord(record: OOTDRecord): Promise<void> {
    await db.records.put(record);
  },

  async deleteRecord(id: string): Promise<void> {
    await db.records.delete(id);
  },

  // Theme (Simple string, keep in localStorage for immediate load)
  getTheme(): string | null {
    return localStorage.getItem(THEME_KEY);
  },

  saveTheme(themeId: string): void {
    localStorage.setItem(THEME_KEY, themeId);
  }
};
